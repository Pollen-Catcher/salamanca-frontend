import DeleteIcon from '@mui/icons-material/Delete'
import HistoryIcon from '@mui/icons-material/History'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Fab,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'

import propose from 'propose'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { getPollenValue, publishPollen, setPollenValue } from '../lib/sheet'
import { pollensList } from '../data/arrays'

interface Props {
  date: string
  currentHour: number
  onHourChange: (hour: number) => void
  onCommit?: (pollen: string, interval: string) => void
  // Controlado por Sheets para que ajuda e log nunca fiquem abertos juntos.
  logOpen: boolean
  onLogOpenChange: (open: boolean) => void
}

const ASR_BASE_URL = 'https://salamanca-project-asr-microservice-space.hf.space'
const ASR_ENDPOINT = `${ASR_BASE_URL}/command`
// Silêncio para fechar o segmento. Era 1500 ms; medido nas gravações reais de
// inputTests, a maior PAUSA INTERNA entre palavras de um comando é 992 ms
// (setUrticaMembranacea21). 1000 ms cortaria esse comando no meio (planta sem
// número -> 400); 1200 ms mantém ~200 ms de margem e ainda economiza 300 ms por
// fala. O hard-split de nova fala continua em MIN_UTTERANCE_GAP_MS.
const SILENCE_DURATION_MS = 1200
const MIN_UTTERANCE_GAP_MS = 1200
const MIN_SPEECH_DURATION_MS = 500
const MAX_SEGMENT_DURATION_MS = 10000
// Teto absoluto do segmento quando NENHUMA fala foi confirmada (aba em
// background, ruído contínuo). Ao bater, o segmento é DESCARTADO, nunca
// enviado ao ASR: é o que evita clipes de 31 s de ruído.
const SEGMENT_MAX_IDLE_MS = 30000
// Os tetos são aplicados por um intervalo próprio porque o loop de segmentação
// roda em requestAnimationFrame, que o navegador congela em aba sem foco.
const SEGMENT_GUARD_INTERVAL_MS = 250
// Com o modelo acordado o comando responde em ~2s. O HF Space hiberna e o
// primeiro request depois disso pode levar ~80s, então o primeiro comando
// ganha um teto bem maior em vez de morrer no timeout curto.
const ASR_TIMEOUT_MS = 15000
const ASR_COLD_START_TIMEOUT_MS = 90000
const ASR_WARMUP_TIMEOUT_MS = 100000
const SPEECH_THRESHOLD = 0.03
const NOISE_CALIBRATION_DURATION_MS = 400
const SPEECH_CONFIRMATION_MS = 180

// O frontend não manda ?prefix nem ?preproc, então o log registra os defaults
// do servidor (ASR_PREFIX_MODE / ASR_PREPROC em server.py, 2026-11-25).
const ASR_PREFIX_MODE = 'full'
const ASR_PREPROC_MODE = 'on'
const MAX_LOG_ENTRIES = 50
const NO_SPEECH_MESSAGE =
  'No speech detected in that segment. Try speaking closer to the microphone.'

type ErrorSink = (message: string) => void

type SegmentCloseReason =
  | 'silence'
  | 'hard-split'
  | 'max-duration'
  | 'idle-guard'
  | 'manual-stop'
  | 'unknown'

interface AsrResult {
  httpStatus: number | null
  recognizedText: string
  latencyMs: number | null
  stageTimings: Record<string, number>
  prefixMode: string
  preprocMode: string
}

interface CommandLogEntry extends AsrResult {
  id: number
  at: string
  error: string
  segmentSpeechMs: number
  segmentDurationMs: number
  silenceMs: number | null
  silenceTailMs: number
  discarded: boolean
  closeReason: SegmentCloseReason
  endpoint: string
}

// O Space devolve "kaldi;dur=1024.3, ffmpeg;dur=174.4" em Server-Timing e
// expõe o header ao browser (access-control-expose-headers: *, 2026-11-25).
function parseServerTiming(header: string | null): Record<string, number> {
  const timings: Record<string, number> = {}
  if (!header) return timings
  header.split(',').forEach((part) => {
    const [name, duration] = part.trim().split(';dur=')
    const ms = Number(duration)
    if (name && Number.isFinite(ms)) timings[name] = ms
  })
  return timings
}

function withAsrMeta(error: Error, meta: AsrResult): Error {
  return Object.assign(error, { asrMeta: meta })
}

function extractErrorDetail(responseText: string): string {
  try {
    const parsed = JSON.parse(responseText)
    if (typeof parsed.detail === 'string' && parsed.detail) return parsed.detail
  } catch {
    return responseText
  }
  return responseText
}

function asrErrorMessage(status: number, responseText: string): string {
  const detail = extractErrorDetail(responseText).replace(/\s+/g, ' ').trim()
  const trace = detail.slice(0, 400)
  if (status === 400) {
    return trace || 'Não entendi o comando. Fale a planta e a quantidade.'
  }
  if (status === 408 || status === 429) {
    return 'O reconhecimento de voz está ocupado ou demorou demais. Tente novamente.'
  }
  return trace
    ? `Falha no servidor de voz (${status}). ${trace}`
    : `Falha no servidor de voz (${status}). Tente novamente.`
}

// Fala um texto: busca o mp3 no servidor (funciona em qualquer navegador - a
// voz nativa do navegador não existe em todos, ex.: Brave no Linux) e, se o
// servidor falhar, cai para a voz nativa (quando ela existir).
async function speak(text: string) {
  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)
    let blob: Blob
    try {
      const response = await fetch(
        `${ASR_BASE_URL}/tts?text=${encodeURIComponent(text)}`,
        { signal: controller.signal, cache: 'no-store' }
      )
      if (!response.ok) throw new Error(`tts ${response.status}`)
      blob = await response.blob()
    } finally {
      window.clearTimeout(timeoutId)
    }

    const audio = new Audio(URL.createObjectURL(blob))
    audio.onended = () => URL.revokeObjectURL(audio.src)
    await audio.play()
  } catch {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = navigator.language || 'pt-BR'
    synth.speak(utterance)
  }
}

export default function Speech({
  date,
  currentHour,
  onHourChange,
  onCommit,
  logOpen,
  onLogOpenChange,
}: Props) {
  const { sheetId } = useParams()
  const interval = `_${currentHour}h`
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessageState] = useState('')
  const [lastResult, setLastResult] = useState('')
  const [readResult, setReadResult] = useState('')
  // Cada segmento em processamento tem seu próprio sink: com comandos seguidos,
  // o showError('') do segmento novo não pode apagar o erro que vai no log do
  // anterior. O sink continua atualizando a tela igual a antes.
  function makeErrorSink(onCapture?: (message: string) => void): ErrorSink {
    return (message) => {
      setErrorMessageState(message)
      onCapture?.(message)
    }
  }
  const showError = makeErrorSink()

  // Log passivo da sessão: segmentos descartados não chegam ao servidor, então
  // só o frontend pode registrar o que aconteceu com eles.
  const [logEntries, setLogEntries] = useState<CommandLogEntry[]>([])
  const logSeqRef = useRef(0)
  function appendLog(entry: Omit<CommandLogEntry, 'id' | 'at'>) {
    logSeqRef.current += 1
    setLogEntries((previous) =>
      [
        {
          ...entry,
          id: logSeqRef.current,
          at: new Date().toLocaleTimeString(),
        },
        ...previous,
      ].slice(0, MAX_LOG_ENTRIES)
    )
  }
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const shouldListenRef = useRef(false)
  const speechCandidateAtRef = useRef<number | null>(null)
  const speechStartedAtRef = useRef<number | null>(null)
  const silenceStartedAtRef = useRef<number | null>(null)
  const calibrationStartedAtRef = useRef<number | null>(null)
  const noiseSamplesRef = useRef<number[]>([])
  const noiseThresholdRef = useRef(SPEECH_THRESHOLD)
  const levelMeterRef = useRef<HTMLDivElement | null>(null)
  const pendingSegmentsRef = useRef(0)
  const processingChainRef = useRef<Promise<void>>(Promise.resolve())
  const lastSpeechAtRef = useRef<number | null>(null)
  // Fala confirmada (acima do limiar) acumulada no segmento atual: segmento
  // com pouco ou nenhum frame de fala é ruído/hesitação e não vai pro ASR.
  const segmentSpeechMsRef = useRef(0)
  const lastFrameAtRef = useRef<number | null>(null)
  // Tetos de duração do segmento aplicados fora do rAF (checkSegmentLimits).
  const segmentStartedAtRef = useRef<number | null>(null)
  const segmentGuardRef = useRef<number | null>(null)
  const discardSegmentRef = useRef(false)
  // Por que o segmento foi fechado - usado no log e não altera a segmentação.
  const closeReasonRef = useRef<SegmentCloseReason>('unknown')
  const isModelWarmRef = useRef(false)
  const [isWakingModel, setIsWakingModel] = useState(false)

  // Aquece o HF Space no mount: se ele hibernou, o /health já dispara o boot
  // enquanto o usuário ainda está escolhendo a estação, em vez de fazer o
  // primeiro comando pagar o cold start inteiro.
  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      ASR_WARMUP_TIMEOUT_MS
    )

    fetch(`${ASR_BASE_URL}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((response) => {
        if (response.ok) isModelWarmRef.current = true
      })
      .catch(() => {
        // silencioso: o próximo comando tenta de novo com timeout longo
      })
      .finally(() => window.clearTimeout(timeoutId))

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  // Trocar de página com o mic ligado não pode deixar o recorder, o rAF e o
  // guard de segmento rodando em background.
  useEffect(() => {
    return () => {
      shouldListenRef.current = false
      resetRecorderState()
    }
  }, [])

  const intervalRef = useRef(interval)
  intervalRef.current = interval
  const dateRef = useRef(date)
  dateRef.current = date

  function hourCommand(hour: number, reportError: ErrorSink = showError) {
    if (isNaN(hour)) return
    if (hour >= 0 && hour <= 23) onHourChange(hour)
    else reportError(`Invalid hour: ${hour}`)
  }

  // "read alnus": lê o valor salvo da planta na coluna (intervalo) selecionado
  // e fala "planta, quantidade" com a voz do navegador.
  async function readCommand(
    proposedPollen: string,
    reportError: ErrorSink = showError
  ) {
    if (!sheetId) {
      reportError('No sheet selected. Open a station sheet and try again.')
      return
    }
    if (!pollensList.find((p) => p === proposedPollen)) return

    try {
      const value = await getPollenValue({
        pollen: proposedPollen,
        sheetId,
        interval: intervalRef.current,
        date: dateRef.current,
      })
      reportError('')
      setReadResult(
        `${proposedPollen} às ${intervalRef.current.replace('_', '')}: ${value}`
      )
      void speak(`${proposedPollen}, ${value}`)
    } catch (error) {
      reportError(
        error instanceof Error
          ? error.message
          : 'Could not read from Firestore. Please try again.'
      )
    }
  }

  async function pollenCommand(
    proposedPollen: string,
    amount: number,
    operation: '+' | '-' | 'set',
    reportError: ErrorSink = showError
  ) {
    if (!sheetId) {
      reportError('No sheet selected. Open a station sheet and try again.')
      return
    }

    if (isNaN(amount)) return
    if (!pollensList.find((p) => p === proposedPollen)) return

    try {
      if (operation === 'set') {
        await setPollenValue({
          pollen: proposedPollen,
          sheetId,
          interval: intervalRef.current,
          amount,
          date: dateRef.current,
        })
      } else {
        const signedAmount = operation === '+' ? amount : -amount
        await publishPollen({
          pollen: proposedPollen,
          sheetId,
          interval: intervalRef.current,
          amount: signedAmount,
          date: dateRef.current,
        })
      }

      reportError('')
      onCommit?.(proposedPollen, intervalRef.current)
    } catch (error) {
      reportError(
        error instanceof Error
          ? error.message
          : 'Could not save to Firestore. Please try again.'
      )
    }
  }

  function resetRecorderState() {
    stopSegmentGuard()
    discardSegmentRef.current = false
    closeReasonRef.current = 'unknown'
    segmentStartedAtRef.current = null
    chunksRef.current = []
    mediaRecorderRef.current = null

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop())
      streamRef.current = null
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    speechCandidateAtRef.current = null
    speechStartedAtRef.current = null
    silenceStartedAtRef.current = null
    calibrationStartedAtRef.current = null
    noiseSamplesRef.current = []
    noiseThresholdRef.current = SPEECH_THRESHOLD
    lastSpeechAtRef.current = null
    segmentSpeechMsRef.current = 0
    lastFrameAtRef.current = null

    if (levelMeterRef.current) {
      levelMeterRef.current.style.width = '0%'
    }
  }

  function resumeListening() {
    if (shouldListenRef.current && streamRef.current) {
      mediaRecorderRef.current?.start(100)
      startSegmentGuard()
      animationFrameRef.current = requestAnimationFrame(monitorSpeech)
    } else {
      resetRecorderState()
    }
  }

  function stopCurrentSegment(reason: SegmentCloseReason = 'unknown') {
    if (mediaRecorderRef.current?.state === 'recording') {
      closeReasonRef.current = reason
      mediaRecorderRef.current.stop()
    }
  }

  function stopSegmentGuard() {
    if (segmentGuardRef.current !== null) {
      window.clearInterval(segmentGuardRef.current)
      segmentGuardRef.current = null
    }
  }

  // Aplica os tetos de duração fora do requestAnimationFrame. Sem isto, uma aba
  // em background congela o loop de segmentação e a gravação só para no Stop
  // manual (foi assim que apareceu um clipe de 31 s em produção).
  function checkSegmentLimits() {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state !== 'recording') return

    const now = Date.now()
    const speechStartedAt = speechStartedAtRef.current
    const segmentStartedAt = segmentStartedAtRef.current

    // Fala contínua longa demais: encerra e ENVIA o que já existe. 10 s é ~3x o
    // maior comando contínuo medido (3,5 s), então nada real fica de fora.
    if (
      speechStartedAt !== null &&
      now - speechStartedAt >= MAX_SEGMENT_DURATION_MS
    ) {
      stopCurrentSegment('max-duration')
      return
    }

    // Segmento arrastado sem fala confirmada: descarta sem chamar o ASR.
    if (
      speechStartedAt === null &&
      segmentStartedAt !== null &&
      now - segmentStartedAt >= SEGMENT_MAX_IDLE_MS
    ) {
      discardSegmentRef.current = true
      stopCurrentSegment('idle-guard')
    }
  }

  function startSegmentGuard() {
    stopSegmentGuard()
    segmentStartedAtRef.current = Date.now()
    segmentGuardRef.current = window.setInterval(
      checkSegmentLimits,
      SEGMENT_GUARD_INTERVAL_MS
    )
  }

  function monitorSpeech() {
    const analyser = analyserRef.current
    const recorder = mediaRecorderRef.current

    if (!analyser || !recorder || recorder.state !== 'recording') return

    const samples = new Uint8Array(analyser.fftSize)
    analyser.getByteTimeDomainData(samples)
    const volume =
      samples.reduce((sum, sample) => sum + Math.abs(sample - 128), 0) /
      samples.length /
      128
    const now = Date.now()
    calibrationStartedAtRef.current ??= now

    if (now - calibrationStartedAtRef.current < NOISE_CALIBRATION_DURATION_MS) {
      noiseSamplesRef.current.push(volume)
      animationFrameRef.current = requestAnimationFrame(monitorSpeech)
      return
    }

    if (noiseSamplesRef.current.length > 0) {
      const averageNoise =
        noiseSamplesRef.current.reduce((sum, sample) => sum + sample, 0) /
        noiseSamplesRef.current.length
      noiseThresholdRef.current = Math.max(SPEECH_THRESHOLD, averageNoise * 2.5)
      noiseSamplesRef.current = []
    }

    if (levelMeterRef.current) {
      levelMeterRef.current.style.width = `${Math.min(
        100,
        Math.round(volume * 220)
      )}%`
    }

    const previousFrameAt = lastFrameAtRef.current
    lastFrameAtRef.current = now
    // Fala confirmada do segmento: só conta frame acima do limiar, e o delta é
    // limitado para que uma aba em background (rAF congelado) não infle o tempo.
    if (previousFrameAt !== null && volume >= noiseThresholdRef.current) {
      segmentSpeechMsRef.current += Math.min(now - previousFrameAt, 200)
    }

    if (volume >= noiseThresholdRef.current) {
      const isFreshOnset =
        speechCandidateAtRef.current === null &&
        speechStartedAtRef.current !== null
      if (
        isFreshOnset &&
        lastSpeechAtRef.current !== null &&
        now - lastSpeechAtRef.current >= MIN_UTTERANCE_GAP_MS
      ) {
        stopCurrentSegment('hard-split')
        return
      }
      lastSpeechAtRef.current = now
      speechCandidateAtRef.current ??= now
      if (
        speechStartedAtRef.current === null &&
        now - speechCandidateAtRef.current >= SPEECH_CONFIRMATION_MS
      ) {
        speechStartedAtRef.current = speechCandidateAtRef.current
      }
      silenceStartedAtRef.current = null
    } else {
      speechCandidateAtRef.current = null
      if (speechStartedAtRef.current !== null) {
        silenceStartedAtRef.current ??= now
      }
    }

    const speechStartedAt = speechStartedAtRef.current
    const silenceStartedAt = silenceStartedAtRef.current
    if (
      silenceStartedAt !== null &&
      now - silenceStartedAt >= SILENCE_DURATION_MS &&
      speechStartedAt !== null &&
      now - speechStartedAt >= MIN_SPEECH_DURATION_MS
    ) {
      stopCurrentSegment('silence')
      return
    }
    if (
      speechStartedAt !== null &&
      now - speechStartedAt >= MAX_SEGMENT_DURATION_MS
    ) {
      stopCurrentSegment('max-duration')
      return
    }

    animationFrameRef.current = requestAnimationFrame(monitorSpeech)
  }

  async function applyCommand(
    commandText: string,
    reportError: ErrorSink = showError
  ) {
    const tokens = commandText
      .trim()
      .replace(/[.,!?]+$/g, '')
      .split(/\s+/)
    const command = tokens.shift()?.toLowerCase() || ''

    const isHourCommand = ['hour', 'time'].includes(command)
    const isMinusCommand = ['minus', 'sub', '-'].includes(command)
    const isSetCommand = command === 'set'
    const isReadCommand = command === 'read'
    const isPollenCommand =
      !isHourCommand && !isMinusCommand && !isSetCommand && !isReadCommand

    setReadResult('')

    if (isHourCommand) {
      const countToken = tokens.find((token) => !isNaN(Number(token)))
      const parsedCount = Number(countToken)
      if (isNaN(parsedCount)) {
        reportError('No numeric count recognized for hour command.')
        return
      }

      hourCommand(parsedCount, reportError)
      reportError('')
      return
    }

    // "read" não leva quantidade: o número (se falado) é descartado e o app
    // lê em voz alta o valor SALVO da planta na coluna selecionada.
    if (isReadCommand) {
      const readTokens = tokens.filter((token) => isNaN(Number(token)))
      const normalizedLatin = readTokens.join(' ').replace(/[-_]+/g, ' ').trim()

      if (!normalizedLatin) {
        reportError('No pollen name recognized in ASR response.')
        return
      }

      const pollen = propose(normalizedLatin, pollensList, {
        ignoreCase: true,
        threshold: 0.45,
      })

      if (!pollen) {
        reportError(`Unrecognized pollen: ${normalizedLatin}`)
        return
      }

      await readCommand(pollen, reportError)
      return
    }

    const countToken = tokens.pop()
    if (isPollenCommand) tokens.unshift(command)
    const normalizedLatin = tokens.join(' ').replace(/[-_]+/g, ' ').trim()

    if (!normalizedLatin) {
      reportError('No pollen name recognized in ASR response.')
      return
    }

    const pollen = propose(normalizedLatin, pollensList, {
      ignoreCase: true,
      threshold: 0.45,
    })

    if (!pollen) {
      reportError(`Unrecognized pollen: ${normalizedLatin}`)
      return
    }

    const parsedCount = Number(countToken)
    if (isNaN(parsedCount)) {
      reportError('No numeric count recognized in ASR response.')
      return
    }

    if (isMinusCommand) {
      await pollenCommand(pollen, parsedCount, '-', reportError)
      return
    }

    if (isSetCommand) {
      await pollenCommand(pollen, parsedCount, 'set', reportError)
      return
    }

    if (isPollenCommand) {
      await pollenCommand(pollen, parsedCount, '+', reportError)
      return
    }

    reportError(`Unsupported command: ${command}`)
  }

  async function sendAudioToAsr(
    audioBlob: Blob,
    reportError: ErrorSink = showError
  ): Promise<AsrResult> {
    const formData = new FormData()
    const mimeType = audioBlob.type || 'audio/webm'
    const extension = mimeType.split('/')[1]?.split(';')[0] || 'webm'
    const audioFile = new File([audioBlob], `voice-command.${extension}`, {
      type: mimeType,
    })

    formData.append('file', audioFile)

    console.debug('[ASR] sending audio', {
      endpoint: ASR_ENDPOINT,
      mimeType,
      size: audioFile.size,
      fileName: audioFile.name,
    })

    const startedAt = performance.now()
    // Anexa latência/etapas até nos erros: assim o log distingue "não chegou
    // ao servidor" de "o servidor não reconheceu o comando".
    const baseMeta = () => ({
      latencyMs: Math.round(performance.now() - startedAt),
      stageTimings: {} as Record<string, number>,
      prefixMode: ASR_PREFIX_MODE,
      preprocMode: ASR_PREPROC_MODE,
    })

    const controller = new AbortController()
    const isWarm = isModelWarmRef.current
    const timeoutMs = isWarm ? ASR_TIMEOUT_MS : ASR_COLD_START_TIMEOUT_MS
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

    if (!isWarm) setIsWakingModel(true)

    let response: Response
    try {
      response = await fetch(ASR_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
    } catch (error) {
      const message =
        error instanceof Error && error.name === 'AbortError'
          ? isWarm
            ? 'ASR request timed out. Please try again.'
            : 'O modelo de voz demorou para acordar. Tente falar de novo agora que ele está carregado.'
          : error instanceof Error
            ? error.message
            : 'Failed to reach the voice server.'
      throw withAsrMeta(new Error(message), {
        httpStatus: null,
        recognizedText: '',
        ...baseMeta(),
      })
    } finally {
      window.clearTimeout(timeoutId)
      setIsWakingModel(false)
    }

    // Se este request voltou, o modelo está de pé.
    isModelWarmRef.current = true

    const responseText = await response.text()
    const meta = {
      ...baseMeta(),
      stageTimings: parseServerTiming(response.headers.get('Server-Timing')),
    }

    if (!response.ok) {
      console.error('[ASR] request failed', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })
      throw withAsrMeta(
        new Error(asrErrorMessage(response.status, responseText)),
        { httpStatus: response.status, recognizedText: '', ...meta }
      )
    }

    const commandText = responseText.trim()
    if (!commandText) {
      throw withAsrMeta(new Error('ASR returned an empty command.'), {
        httpStatus: response.status,
        recognizedText: '',
        ...meta,
      })
    }

    setLastResult(commandText)
    await applyCommand(commandText, reportError)

    return {
      httpStatus: response.status,
      recognizedText: commandText,
      ...meta,
    }
  }

  const handleListening = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showError('Microphone is not available in this browser.')
      return
    }

    showError('')
    setLastResult('')
    setReadResult('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      audioContext.createMediaStreamSource(stream).connect(analyser)
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      shouldListenRef.current = true

      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000,
      }
      if (
        typeof MediaRecorder !== 'undefined' &&
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ) {
        recorderOptions.mimeType = 'audio/webm;codecs=opus'
      }
      const mediaRecorder = new MediaRecorder(stream, recorderOptions)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stopSegmentGuard()
        const discarded = discardSegmentRef.current
        discardSegmentRef.current = false
        const audioBlob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || 'audio/webm',
        })
        const segmentSpeechMs = segmentSpeechMsRef.current
        // Capturado antes dos resets: são os números que o log precisa mostrar.
        const stoppedAt = Date.now()
        const segmentStartedAt = segmentStartedAtRef.current
        const silenceStartedAt = silenceStartedAtRef.current
        const closeReason = closeReasonRef.current
        const segmentMeta = {
          segmentSpeechMs,
          segmentDurationMs:
            segmentStartedAt !== null ? stoppedAt - segmentStartedAt : 0,
          silenceMs:
            silenceStartedAt !== null ? stoppedAt - silenceStartedAt : null,
          silenceTailMs: SILENCE_DURATION_MS,
          discarded,
          closeReason,
          endpoint: ASR_ENDPOINT,
        }
        closeReasonRef.current = 'unknown'

        chunksRef.current = []
        speechStartedAtRef.current = null
        silenceStartedAtRef.current = null
        speechCandidateAtRef.current = null
        lastSpeechAtRef.current = null
        segmentSpeechMsRef.current = 0
        lastFrameAtRef.current = null
        segmentStartedAtRef.current = null

        if (levelMeterRef.current) {
          levelMeterRef.current.style.width = '0%'
        }

        if (!audioBlob.size) {
          appendLog({
            ...segmentMeta,
            recognizedText: '',
            httpStatus: null,
            latencyMs: null,
            stageTimings: {},
            prefixMode: ASR_PREFIX_MODE,
            preprocMode: ASR_PREPROC_MODE,
            error: 'Empty audio segment (not sent).',
          })
          resumeListening()
          return
        }

        // Segmento sem fala confirmada (hesitação, ventilador, clique) ou que
        // estourou o teto sem nunca ter fala: não vai pro ASR. Parada manual não
        // é erro - o usuário pode apertar Stop logo após falar, antes do VAD
        // acumular 500 ms, e não deve ver "no speech" por isso.
        if (discarded || segmentSpeechMs < MIN_SPEECH_DURATION_MS) {
          const manualStop = closeReason === 'manual-stop'
          const message = manualStop ? '' : NO_SPEECH_MESSAGE
          setLastResult('')
          showError(message)
          appendLog({
            ...segmentMeta,
            recognizedText: '',
            httpStatus: null,
            latencyMs: null,
            stageTimings: {},
            prefixMode: ASR_PREFIX_MODE,
            preprocMode: ASR_PREPROC_MODE,
            error: manualStop
              ? 'Manual stop (no confirmed speech, not sent).'
              : NO_SPEECH_MESSAGE,
          })
          resumeListening()
          return
        }

        // Resultado/erro na tela sempre se referem a ESTE segmento: sem isso o
        // texto do comando anterior continuava visível ao lado de um erro novo.
        setLastResult('')
        showError('')

        pendingSegmentsRef.current += 1
        setIsProcessing(true)

        processingChainRef.current = processingChainRef.current
          .then(async () => {
            let segmentError = ''
            const reportError = makeErrorSink((message) => {
              segmentError = message
            })
            try {
              const result = await sendAudioToAsr(audioBlob, reportError)
              appendLog({
                ...segmentMeta,
                ...result,
                error: segmentError,
              })
            } catch (error) {
              const meta = (error as Error & { asrMeta?: AsrResult }).asrMeta
              reportError(
                error instanceof Error
                  ? error.message
                  : 'Failed to process audio command.'
              )
              appendLog({
                ...segmentMeta,
                ...(meta ?? {
                  httpStatus: null,
                  recognizedText: '',
                  latencyMs: null,
                  stageTimings: {},
                  prefixMode: ASR_PREFIX_MODE,
                  preprocMode: ASR_PREPROC_MODE,
                }),
                error: segmentError,
              })
            } finally {
              pendingSegmentsRef.current -= 1
              if (pendingSegmentsRef.current === 0) {
                setIsProcessing(false)
              }
            }
          })
          .catch(() => {})

        resumeListening()
      }

      calibrationStartedAtRef.current = null
      noiseSamplesRef.current = []
      mediaRecorder.start(100)
      startSegmentGuard()
      setIsListening(true)
      animationFrameRef.current = requestAnimationFrame(monitorSpeech)
    } catch {
      resetRecorderState()
      shouldListenRef.current = false
      showError('Could not access microphone.')
      setIsListening(false)
    }
  }

  const stopHandle = () => {
    shouldListenRef.current = false
    setIsListening(false)

    if (mediaRecorderRef.current?.state === 'recording') {
      closeReasonRef.current = 'manual-stop'
      mediaRecorderRef.current.stop()
      return
    }

    resetRecorderState()
  }

  const handleReset = () => {
    stopHandle()
    showError('')
    setLastResult('')
    setReadResult('')
  }

  return (
    <Box className="flex w-full flex-col items-center justify-center">
      <ButtonGroup disableElevation variant="contained" className="py-2">
        <Button disabled={isListening} onClick={handleListening}>
          Listen
        </Button>
        {isListening && <Button onClick={stopHandle}>Stop</Button>}
      </ButtonGroup>

      <Typography variant="caption" sx={{ color: '#5e6060' }}>
        Intervalo atual: {interval} {`(fale "hour N" para mudar)`}
      </Typography>

      {isListening && (
        <Alert
          style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
          severity="info"
        >
          Listening...
        </Alert>
      )}

      {isListening && (
        <Box className="mt-2 w-44">
          <div
            ref={levelMeterRef}
            className="h-1.5 rounded"
            style={{
              width: '0%',
              backgroundColor: '#233143',
              transition: 'width 100ms linear',
            }}
          />
        </Box>
      )}

      {isWakingModel && (
        <Alert
          style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
          severity="info"
        >
          Acordando o modelo de voz... o primeiro comando pode levar até 1
          minuto.
        </Alert>
      )}

      {isProcessing && (
        <Alert
          style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
          severity="info"
        >
          Processing command...
        </Alert>
      )}

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {readResult && <Alert severity="success">{readResult}</Alert>}

      {lastResult && (
        <Box className="justify-center p-2">
          <Box sx={{ color: '#5e6060' }}>{lastResult}</Box>
          <br />
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Reset
          </Button>
        </Box>
      )}

      {logOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 152,
            width: { xs: 'calc(100vw - 48px)', sm: 300 },
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: '50vh',
            overflowY: 'auto',
            zIndex: (theme) => theme.zIndex.appBar - 1,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}
            >
              Log de comandos ({logEntries.length})
            </Typography>
            <Button
              size="small"
              onClick={() => setLogEntries([])}
              disabled={logEntries.length === 0}
            >
              Limpar
            </Button>
          </Box>
          {logEntries.length === 0 ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Nenhum comando nesta sessão.
              </Typography>
            </Box>
          ) : (
            <List dense sx={{ py: 0.5 }}>
              {logEntries.map((entry) => (
                <ListItem
                  key={entry.id}
                  alignItems="flex-start"
                  sx={{
                    display: 'block',
                    px: 2,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {entry.at}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      wordBreak: 'break-word',
                      color:
                        !entry.recognizedText && entry.error
                          ? 'error.main'
                          : 'text.primary',
                    }}
                  >
                    {entry.recognizedText || entry.error || '—'}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
      <Fab
        color="secondary"
        aria-label={logOpen ? 'Fechar log de comandos' : 'Abrir log de comandos'}
        onClick={() => onLogOpenChange(!logOpen)}
        sx={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          boxShadow: 4,
        }}
      >
        <HistoryIcon />
      </Fab>
    </Box>
  )
}
