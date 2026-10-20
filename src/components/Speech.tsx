import DeleteIcon from '@mui/icons-material/Delete'
import { Alert, Box, Button, ButtonGroup, Typography } from '@mui/material'

import propose from 'propose'

import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { publishPollen, setPollenValue } from '../lib/sheet'
import { pollensList } from '../data/arrays'

interface Props {
  date: string
  onCommit?: (pollen: string, interval: string) => void
}

const ASR_ENDPOINT =
  'https://salamanca-project-asr-microservice-space.hf.space/command'
const SILENCE_DURATION_MS = 1500
const MIN_UTTERANCE_GAP_MS = 1200
const MIN_SPEECH_DURATION_MS = 500
const MAX_SEGMENT_DURATION_MS = 10000
const ASR_TIMEOUT_MS = 15000
const SPEECH_THRESHOLD = 0.03
const NOISE_CALIBRATION_DURATION_MS = 400
const SPEECH_CONFIRMATION_MS = 180

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

export default function Speech({ date, onCommit }: Props) {
  const { sheetId } = useParams()
  const [interval, setInterval] = useState('_0h')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastResult, setLastResult] = useState('')
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

  const intervalRef = useRef(interval)
  intervalRef.current = interval
  const dateRef = useRef(date)
  dateRef.current = date

  function hourCommand(hour: number) {
    if (isNaN(hour)) return
    if (hour >= 0 && hour <= 23) {
      setInterval(`_${hour}h`)
    } else {
      setErrorMessage(`Invalid hour: ${hour}`)
    }
  }

  async function pollenCommand(
    proposedPollen: string,
    amount: number,
    operation: '+' | '-' | 'set'
  ) {
    if (!sheetId) {
      setErrorMessage('No sheet selected. Open a station sheet and try again.')
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

      setErrorMessage('')
      onCommit?.(proposedPollen, intervalRef.current)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not save to Firestore. Please try again.'
      )
    }
  }

  function resetRecorderState() {
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

    if (levelMeterRef.current) {
      levelMeterRef.current.style.width = '0%'
    }
  }

  function resumeListening() {
    if (shouldListenRef.current && streamRef.current) {
      mediaRecorderRef.current?.start(100)
      animationFrameRef.current = requestAnimationFrame(monitorSpeech)
    } else {
      resetRecorderState()
    }
  }

  function stopCurrentSegment() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
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

    if (volume >= noiseThresholdRef.current) {
      const isFreshOnset =
        speechCandidateAtRef.current === null &&
        speechStartedAtRef.current !== null
      if (
        isFreshOnset &&
        lastSpeechAtRef.current !== null &&
        now - lastSpeechAtRef.current >= MIN_UTTERANCE_GAP_MS
      ) {
        stopCurrentSegment()
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
      (silenceStartedAt !== null &&
        now - silenceStartedAt >= SILENCE_DURATION_MS &&
        speechStartedAt !== null &&
        now - speechStartedAt >= MIN_SPEECH_DURATION_MS) ||
      (speechStartedAt !== null &&
        now - speechStartedAt >= MAX_SEGMENT_DURATION_MS)
    ) {
      stopCurrentSegment()
      return
    }

    animationFrameRef.current = requestAnimationFrame(monitorSpeech)
  }

  async function applyCommand(commandText: string) {
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

    if (isHourCommand) {
      const countToken = tokens.find((token) => !isNaN(Number(token)))
      const parsedCount = Number(countToken)
      if (isNaN(parsedCount)) {
        setErrorMessage('No numeric count recognized for hour command.')
        return
      }

      hourCommand(parsedCount)
      setErrorMessage('')
      return
    }

    const countToken = tokens.pop()
    if (isPollenCommand) tokens.unshift(command)
    const normalizedLatin = tokens.join(' ').replace(/[-_]+/g, ' ').trim()

    if (!normalizedLatin) {
      setErrorMessage('No pollen name recognized in ASR response.')
      return
    }

    const pollen = propose(normalizedLatin, pollensList, {
      ignoreCase: true,
      threshold: 0.45,
    })

    if (!pollen) {
      setErrorMessage(`Unrecognized pollen: ${normalizedLatin}`)
      return
    }

    if (isReadCommand) {
      setErrorMessage(`Read command recognized for ${pollen}.`)
      return
    }

    const parsedCount = Number(countToken)
    if (isNaN(parsedCount)) {
      setErrorMessage('No numeric count recognized in ASR response.')
      return
    }

    if (isMinusCommand) {
      await pollenCommand(pollen, parsedCount, '-')
      return
    }

    if (isSetCommand) {
      await pollenCommand(pollen, parsedCount, 'set')
      return
    }

    if (isPollenCommand) {
      await pollenCommand(pollen, parsedCount, '+')
      return
    }

    setErrorMessage(`Unsupported command: ${command}`)
  }

  async function sendAudioToAsr(audioBlob: Blob) {
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

    const controller = new AbortController()
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      ASR_TIMEOUT_MS
    )

    let response: Response
    try {
      response = await fetch(ASR_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('ASR request timed out. Please try again.')
      }
      throw error
    } finally {
      window.clearTimeout(timeoutId)
    }

    const responseText = await response.text()

    if (!response.ok) {
      console.error('[ASR] request failed', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })
      throw new Error(asrErrorMessage(response.status, responseText))
    }

    const commandText = responseText.trim()
    if (!commandText) {
      throw new Error('ASR returned an empty command.')
    }

    setLastResult(commandText)
    await applyCommand(commandText)
  }

  const handleListening = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Microphone is not available in this browser.')
      return
    }

    setErrorMessage('')
    setLastResult('')

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
        const audioBlob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || 'audio/webm',
        })

        chunksRef.current = []
        speechStartedAtRef.current = null
        silenceStartedAtRef.current = null
        speechCandidateAtRef.current = null
        lastSpeechAtRef.current = null

        if (levelMeterRef.current) {
          levelMeterRef.current.style.width = '0%'
        }

        if (!audioBlob.size) {
          resumeListening()
          return
        }

        pendingSegmentsRef.current += 1
        setIsProcessing(true)

        processingChainRef.current = processingChainRef.current
          .then(async () => {
            try {
              await sendAudioToAsr(audioBlob)
            } catch (error) {
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : 'Failed to process audio command.'
              )
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
      setIsListening(true)
      animationFrameRef.current = requestAnimationFrame(monitorSpeech)
    } catch {
      resetRecorderState()
      shouldListenRef.current = false
      setErrorMessage('Could not access microphone.')
      setIsListening(false)
    }
  }

  const stopHandle = () => {
    shouldListenRef.current = false
    setIsListening(false)

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      return
    }

    resetRecorderState()
  }

  const handleReset = () => {
    stopHandle()
    setErrorMessage('')
    setLastResult('')
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

      {isProcessing && (
        <Alert
          style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
          severity="info"
        >
          Processing command...
        </Alert>
      )}

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

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
    </Box>
  )
}
