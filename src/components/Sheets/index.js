import { addDoc, collection } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'

import { FirebaseContext } from '../../contexts/firebaseContext'
import { Pollen, pollenConverter } from '../../models/Pollen'
import Sheets from './Sheet'

export default () => {
  const { sheetId } = useParams()
  const { db } = useContext(FirebaseContext)

  const [name, setName] = useState('')

  const pollenCollectionRef = collection(
    db,
    'sheets',
    sheetId,
    'pollens'
  ).withConverter(pollenConverter)
  const [pollens] = useCollectionData(pollenCollectionRef)

  const addPollen = async () => {
    const pollen = new Pollen(name)
    await addDoc(pollenCollectionRef, pollen)
  }

  // const handleCellEditCommit = async (params) => {
  //   const currentRef = doc(db, 'sheets', sheetId, 'pollens', params.id)
  //   await updateDoc(currentRef, {
  //     [`intervals.${params.field}`]: params.value,
  //   })
  // }

  return (
    <Sheets
      setName={setName}
      pollens={pollens}
      sheetId={sheetId}
      addPollen={addPollen}
    />
  )
}