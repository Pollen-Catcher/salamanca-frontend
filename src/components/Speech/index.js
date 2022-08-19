import chalk from 'chalk'
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from 'firebase/firestore'
import PropTypes from 'prop-types'
import propose from 'propose'
import { useContext, useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import wordsToNumbers from 'words-to-numbers'

import { FirebaseContext } from '../../contexts/firebaseContext'
import { pollensList } from '../../data/arrays'
import { Pollen, pollenConverter } from '../../models/Pollen'
import Speech from './Speech'

function Index({ pollens, sheetId }) {
  const { db } = useContext(FirebaseContext)
  const [interval, setInterval] = useState('intervals._0h')
  const pollenCollectionRef = collection(
    db,
    'sheets',
    sheetId,
    'pollens'
  ).withConverter(pollenConverter)

  const hourCommand = (hour) => {
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      console.log(chalk.magenta('hour: ', hour))
      setInterval(`intervals._${hour}h`)
    } else {
      const refactordHour = wordsToNumbers(hour, { fuzzy: true })
      console.log(chalk.bgBlueBright('refactordHour: ', refactordHour))
      if (!isNaN(refactordHour) && refactordHour >= 0 && refactordHour <= 23) {
        console.log(chalk.magenta('hour: ', refactordHour))
        setInterval(`intervals._${refactordHour}h`)
      } else {
        console.log(chalk.red('Invalid hour'))
      }
    }
  }

  const pollenCommand = async (proposedPollen, amount, operation) => {
    let docRef
    if (!pollens.find((p) => p.name === proposedPollen)) {
      const newPollen = new Pollen(proposedPollen)
      docRef = await addDoc(pollenCollectionRef, newPollen)
      console.log(chalk.green(`Added ${proposedPollen} with id ${docRef.id}`))
    }

    if (isNaN(amount)) {
      console.log(chalk.red('Amount is not a number'))
      resetTranscript()
      return
    }

    const { id } = pollens.find((p) => p.name === proposedPollen) || docRef
    console.log(chalk.magenta('id: ', id))
    const ref = doc(db, 'sheets', sheetId, 'pollens', id)

    if (operation === '-') {
      amount = -amount
    }

    await updateDoc(ref, {
      [interval]: increment(amount),
    }).then(() => {
      console.log(chalk.green(`Updated ${proposedPollen}`))
    })
  }

  const commands = [
    {
      command: ['reset', 'clear', 'stop'],
      callback: ({ resetTranscript }) => {
        resetTranscript()
      },
    },
    {
      command: [':firstArgument :secondArgument'],
      callback: (firstArgument, secondArgument, { resetTranscript }) => {
        console.log('Comando', firstArgument, secondArgument)
        const hourLabel = propose(firstArgument, ['hour', 'time'], {
          ignoreCase: true,
          threshold: 0.3,
        })

        if (hourLabel) {
          hourCommand(secondArgument)
          resetTranscript()
          return
        }

        const pollen = propose(firstArgument, pollensList, {
          ignoreCase: true,
          threshold: 0.3,
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
      callback: async (firstArgument, secondArgument, { resetTranscript }) => {
        const pollen = propose(firstArgument, pollensList, {
          ignoreCase: true,
          threshold: 0.3,
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

  const stopHandleListening = () => {
    setIsListening(false)
    SpeechRecognition.stopListening()
  }

  const handleResetListening = () => {
    stopHandleListening()
    resetTranscript()
  }

  return (
    <Speech
      transcript={transcript}
      isListening={isListening}
      handleListening={handleListening}
      stopHandle={stopHandleListening}
      handleReset={handleResetListening}
    />
  )
}

Index.propTypes = {
  sheetId: PropTypes.string.isRequired,
  pollens: PropTypes.array.isRequired,
}

export default Index
