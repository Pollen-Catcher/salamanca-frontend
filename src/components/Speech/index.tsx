import DeleteIcon from '@mui/icons-material/Delete'
import { Alert, Box, Button, ButtonGroup } from '@mui/material'
import chalk from 'chalk'
import { increment, updateDoc, setDoc, DocumentReference, DocumentData, FirestoreError } from 'firebase/firestore'
import propose from 'propose'

import { useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { pollensList } from '../../data/arrays'
import { Pollen } from '../../types/pollen'

interface Props {
  pollens: Pollen[],
  sheetRef: DocumentReference<DocumentData>
}

export default function Speech({ pollens, sheetRef }: Props) {
  const [interval, setInterval] = useState('_0h')

  const hourCommand = (hour: number) => {
    console.log("Hour Command")
    if (hour >= 0 && hour <= 23) {
      console.log(chalk.blue('hour atualizada: ', hour))
      setInterval(`_${hour}h`)
    } else {
      console.log(chalk.red('hour: ', hour))
    }
  }

  const pollenCommand = async (proposedPollen: string, amount: number, operation: string) => {
    if (!sheetRef) {
      console.log(chalk.red('sheetRef is undefined'))
      resetTranscript()
      return
    }
    if (isNaN(amount)) {
      console.log(chalk.red('Amount is not a number'))
      resetTranscript()
      return
    }
    if (!pollensList.find((p) => p === proposedPollen)) {
      console.log(chalk.red('Pollen not found'))
      resetTranscript()
      return
    }

    amount = operation === '+' ? amount : -amount
    await updateDoc(sheetRef, {
      [`${proposedPollen}.${interval}`]: increment(amount),
    }).then(() => {
      console.log(chalk.green(`Updated ${proposedPollen}`))
    }).catch(async (e: FirestoreError) => {
      if (e.code === "not-found") {
        await setDoc(sheetRef, {
          [proposedPollen]: {
            [interval]: Math.abs(amount)
          }
        }).then(() => {
          console.log(chalk.green(`Set ${proposedPollen}`))
        })
      }
    })
  }


  const commands = [
    {
      command: ['reset', 'clear', 'stop'],
      callback: ({ resetTranscript }: any) => {
        console.log(chalk.blue('Resetting...'))
        resetTranscript()
      },
    },
    {
      command: [':firstArgument :secondArgument'],
      callback: (firstArgument: string, secondArgument: number, { resetTranscript }: any) => {
        console.log('Comando', firstArgument, secondArgument)
        const hourLabel = propose(firstArgument, ['hour', 'time'], {
          ignoreCase: true,
          threshold: 0.5,
        })

        if (hourLabel) {
          hourCommand(secondArgument)
          resetTranscript()
          return
        }
        console.log("ADD COMMAND")

        const pollen = propose(firstArgument, pollensList, {
          ignoreCase: true,
          threshold: 0.5,
        })

        if (pollen) {
          console.log(chalk.magenta('pollen: ', pollen))
          pollenCommand(pollen, secondArgument, '+')
          resetTranscript()
          return
        }

        console.log(
          chalk.red('Invalid command. It is not a valid hour or pollen')
        )

        resetTranscript()
        return
      },
    },
    {
      command: [
        ':firstArgument minus :secondArgument',
        ':firstArgument - :secondArgument',
      ],
      callback: async (firstArgument: string, secondArgument: number, { resetTranscript }: any) => {
        console.log("Minus Command")
        const pollen = propose(firstArgument, pollensList, {
          ignoreCase: true,
          threshold: 0.5,
        })
        if (pollen) {
          pollenCommand(pollen, secondArgument, '-')
          resetTranscript()
          return
        }

        console.log(chalk.red('Invalid command. It is not a valid pollen'))
        resetTranscript()
      },
    },
  ]

  const { resetTranscript, transcript } = useSpeechRecognition({
    commands,
  })
  const [isListening, setIsListening] = useState(false)
  const handleListening = () => {
    setIsListening(true)
    SpeechRecognition.startListening({
      language: 'en-US',
      continuous: true,
    })
  }
  const stopHandle = () => {
    setIsListening(false)
    SpeechRecognition.stopListening()
  }
  const handleReset = () => {
    stopHandle()
    resetTranscript()
  }

  return (
    <Box className="microphone-wrapper flex w-full flex-col items-center justify-center">
      <ButtonGroup disableElevation variant="contained" className="py-2">
        <Button onClick={handleListening}>Listen</Button>
        {isListening && <Button onClick={stopHandle}>Stop</Button>}
      </ButtonGroup>

      {isListening && (
        <Alert
          style={{ color: '#233143', backgroundColor: '#b8bcc2' }}
          severity="info"
        >
          Listening...
        </Alert>
      )}

      {transcript && (
        <Box className="microphone-result-container justify-center p-2">
          <Box sx={{ color: '#5e6060' }}>{transcript}</Box>
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


