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
import { commandsList, pollensList } from '../../data/arrays'
import { Pollen, pollenConverter } from '../../models/Pollen'
import Speech from './Speech'

function Index({ pollens, sheetId }) {
  const { db } = useContext(FirebaseContext)

  const [interval, setInterval] = useState('intervals._0h')
  const [command, setCommand] = useState('add')
  // eslint-disable-next-line no-unused-vars
  const [pollen, setPollen] = useState('')

  const pollenCollectionRef = collection(
    db,
    'sheets',
    sheetId,
    'pollens'
  ).withConverter(pollenConverter)

  const commands = [
    {
      command: ['reset', 'clear'],
      callback: ({ resetTranscript }) => {
        resetTranscript()
        return
      },
    },
    {
      command: ['hour :hour', 'our :hour'],
      callback: (hour, { resetTranscript }) => {
        console.log(chalk.yellow('hour: ', hour))

        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
          console.log(chalk.magenta('hour: ', hour))
          setInterval(`intervals._${hour}h`)
        } else {
          const refactordHour = wordsToNumbers(hour, { fuzzy: true })
          if (
            !isNaN(refactordHour) &&
            refactordHour >= 0 &&
            refactordHour <= 23
          ) {
            console.log(chalk.magenta('hour: ', refactordHour))
            setInterval(`intervals._${refactordHour}h`)
          } else {
            console.log(chalk.red('Invalid hour'))
          }
        }

        resetTranscript()

        return
      },
    },
    {
      command: ['set :pollen', 'pin :pollen'],
      callback: async (pollenType, { resetTranscript }) => {
        console.log(chalk.yellow('set ', pollenType))

        if (!pollenType) {
          console.log(chalk.red('No pollen specified'))
          resetTranscript()
          return
        }

        const proposedPollen = propose(pollenType, pollensList, {
          ignoreCase: true,
          threshold: 0.2,
        })
        console.log(chalk.magenta('proposedPollen: ', proposedPollen))

        const pollenIndex = pollensList.indexOf(proposedPollen)
        if (pollenIndex === -1) {
          console.log(chalk.red(`${pollenType} is not a valid pollen`))
          resetTranscript()
          return
        }

        if (!pollens.find((p) => p.name === proposedPollen)) {
          const newPollen = new Pollen(proposedPollen)
          const doc = await addDoc(pollenCollectionRef, newPollen)
          console.log(chalk.green(`Added ${proposedPollen} with id ${doc.id}`))
        }

        setPollen(proposedPollen)

        resetTranscript()
      },
    },
    {
      command: [':pollenType :amount'],
      callback: async (pollenType, amount, { resetTranscript }) => {
        if (
          pollenType == 'our' ||
          pollenType == 'hour' ||
          pollenType == 'set' ||
          pollenType == 'reset' ||
          pollenType == 'clear' ||
          pollenType == 'pin'
        ) {
          return
        }

        console.log(chalk.yellow(':pollenType :amount'))
        console.log(chalk.yellow(pollenType, amount))

        const proposedPollen = propose(pollenType, pollensList, {
          ignoreCase: true,
          threshold: 0.5,
        })

        console.log(chalk.blue('proposedPollen: ', proposedPollen))

        if (!proposedPollen) {
          console.log(chalk.red('Could not find required pollen'))
          resetTranscript()
          return
        }

        // if (proposedPollen != pollen) {
        //   console.log(
        //     chalk.red('The pollen you are searching for is not the fixed one')
        //   )
        //   resetTranscript()
        //   return
        // }

        if (isNaN(amount)) {
          console.log(chalk.red('Amount is not a number'))
          resetTranscript()
          return
        }

        const { id } = pollens.find((p) => p.name === proposedPollen) || {}
        if (!id) {
          console.log(chalk.red('You need to set the pollen first'))
        }

        const ref = doc(db, 'sheets', sheetId, 'pollens', id)

        await updateDoc(ref, {
          [interval]: increment(amount),
        }).then(() => {
          console.log(chalk.bgGreen('Added'))
        })

        resetTranscript()
      },
    },
    {
      command: [':pollenType minus :amount', ':pollenType - :amount'],
      callback: async (pollenType, amount, { resetTranscript }) => {
        if (
          pollenType == 'our' ||
          pollenType == 'hour' ||
          pollenType == 'set' ||
          pollenType == 'reset' ||
          pollenType == 'clear' ||
          pollenType == 'pin'
        ) {
          return
        }

        console.log(chalk.yellow(':pollenType :amount'))
        console.log(chalk.yellow(pollenType, amount))

        const proposedPollen = propose(pollenType, pollensList, {
          ignoreCase: true,
          threshold: 0.5,
        })

        console.log(chalk.blue('proposedPollen: ', proposedPollen))

        if (!proposedPollen) {
          console.log(chalk.red('Could not find required pollen'))
          resetTranscript()
          return
        }

        // if (proposedPollen != pollen) {
        //   console.log(
        //     chalk.red('The pollen you are searching for is not the fixed one')
        //   )
        //   resetTranscript()
        //   return
        // }

        if (isNaN(amount)) {
          console.log(chalk.red('Amount is not a number'))
          resetTranscript()
          return
        }

        const { id } = pollens.find((p) => p.name === proposedPollen) || {}
        if (!id) {
          console.log(chalk.red('You need to set the pollen first'))
        }

        const ref = doc(db, 'sheets', sheetId, 'pollens', id)

        await updateDoc(ref, {
          [interval]: increment(-amount),
        }).then(() => {
          console.log(chalk.bgGreen('Removed'))
        })

        resetTranscript()
      },
    },
    {
      command: ['use command :commandType', 'use :commandType'],
      callback: (commandType, { resetTranscript }) => {
        const proposedCommand = propose(commandType, commandsList, {
          ignoreCase: true,
          threshold: 0.2,
        })

        if (!proposedCommand) {
          console.log('Command not found')
          resetTranscript()
          return
        }

        setCommand(proposedCommand)
        resetTranscript()
      },
    },
    {
      command: ['do :pollenType :amount'],
      callback: async (pollenType, amount, { resetTranscript }) => {
        const proposedPollen = propose(pollenType, pollensList, {
          ignoreCase: true,
          threshold: 0.2,
        })
        console.log('proposedPollen', proposedPollen)

        if (!proposedPollen) {
          console.log('No pollen found')
          resetTranscript()
          return
        }

        if (isNaN(amount)) {
          console.log('Invalid amount')
          resetTranscript()
          return
        }

        let { id } = pollens.find((p) => p.name === proposedPollen) || {}
        if (!id) {
          if (!pollensList.includes(proposedPollen)) {
            console.log('No pollen found')
            resetTranscript()
            return
          } else {
            const newPollen = new Pollen(proposedPollen)
            const docRef = await addDoc(pollenCollectionRef, newPollen)
            id = docRef.id
            console.log('newPollen', id)
          }
        }

        const ref = doc(db, 'sheets', sheetId, 'pollens', id)

        switch (command) {
          case 'add':
            await updateDoc(ref, {
              [interval]: increment(amount),
            }).then(() => {
              console.log('Added')
            })
            break
          case 'delete':
            await updateDoc(ref, {
              [interval]: increment(-amount),
            })
            break
        }

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
