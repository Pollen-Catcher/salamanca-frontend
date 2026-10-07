import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router'
import propose from 'propose'
import { pollensList } from '../data/arrays'
import { getPollenValue, publishPollen, setPollenValue } from '../lib/sheet'
import { HelpModal } from './HelpModal'

interface Props {
  date: string
  currentHour: number
  onHourChange: (hour: number) => void
}

export default function CommandBar({
  date,
  currentHour,
  onHourChange,
}: Props) {
  const { sheetId } = useParams()
  const [inputCommand, setInputCommand] = useState('')
  const [feedback, setFeedback] = useState('')

  async function handleCommand(commandText: string) {
    const parts = commandText.trim().split(/\s+/)
    const action = parts[0]?.toLowerCase()
    const interval = `_${currentHour}h`

    if (action === 'hour' || action === 'time' || action === 'hora') {
      const hour = Number(parts[1])
      if (parts.length !== 2 || !Number.isInteger(hour) || hour < 0 || hour > 23) {
        window.alert('Informe uma hora inteira entre 0 e 23. Exemplo: hour 10')
        return
      }
      onHourChange(hour)
      setFeedback(`Hora selecionada: ${hour}.`)
      return
    }

    const isSet = action === 'set'
    const isRead = action === 'read' || action === 'ler'
    const pollenParts = parts.slice(isSet || isRead ? 1 : 0)
    const amount = isRead ? undefined : Number(pollenParts[pollenParts.length - 1])
    const pollenName = (isRead ? pollenParts : pollenParts.slice(0, -1)).join(' ')

    if (!pollenName || (!isRead && !Number.isFinite(amount))) {
      window.alert('Comando inválido. Use [pólen] [número], set [pólen] [número] ou read [pólen].')
      return
    }

    const pollen = propose(pollenName, pollensList, {
      ignoreCase: true,
      threshold: 0.5,
    })
    if (!pollen) {
      window.alert(`Pólen não reconhecido: ${pollenName}`)
      return
    }

    if (!sheetId) {
      throw new Error('Não foi possível identificar a planilha atual.')
    }

    if (isRead) {
      const value = await getPollenValue({
        pollen,
        interval,
        sheetId,
        date,
      })
      window.alert(`O valor atual para ${pollen} na hora ${currentHour} é: ${value}`)
      return
    }

    if (!Number.isFinite(amount)) {
      window.alert('Informe um número válido.')
      return
    }

    if (isSet) {
      await setPollenValue({
        pollen,
        interval,
        amount,
        sheetId,
        date,
      })
      setFeedback(`${pollen}: valor definido como ${amount} na hora ${currentHour}.`)
      return
    }

    await publishPollen({
      pollen,
      interval,
      amount,
      sheetId,
      date,
    })
    setFeedback(`${pollen}: ${amount} adicionado na hora ${currentHour}.`)
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const command = inputCommand.trim()
    if (!command) return

    try {
      await handleCommand(command)
      setInputCommand('')
    } catch (error) {
      console.error('Erro ao executar comando:', error)
      setFeedback('Não foi possível executar o comando. Tente novamente.')
    }
  }

  return (
    <>
      <form onSubmit={handleSend} className="flex w-full gap-2">
        <input
          type="text"
          value={inputCommand}
          onChange={(event) => setInputCommand(event.target.value)}
          placeholder="Digite um comando..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          Enviar
        </button>
        <HelpModal />
      </form>
      {feedback && <p role="status" className="pt-2 text-sm text-gray-700">{feedback}</p>}
    </>
  )
}