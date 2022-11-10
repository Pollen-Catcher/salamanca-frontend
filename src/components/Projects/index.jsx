import { addDoc, collection } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'
import { Sheet, sheetConverter } from '../../models/Sheet'
import Projects from './Projects'

const defaultValues = {
  name: '',
  location: '',
}

export default () => {
  const { db } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)

  //modal dialog
  const [openCreateSheet, setOpenCreateSheet] = useState(false)
  const handleOpenCreateSheet = () => setOpenCreateSheet(true)
  const handleCloseCreateSheet = () => setOpenCreateSheet(false)

  //form
  const { handleSubmit, control } = useForm({ defaultValues })

  const addSheet = async (data) => {
    const { name, location } = data
    const sheet = new Sheet(name, location)
    await addDoc(
      collection(db, `users/${user?.uid}/sheets`).withConverter(sheetConverter),
      sheet
    )
  }
  return (
    <Projects
      openCreateSheet={openCreateSheet}
      handleOpenCreateSheet={handleOpenCreateSheet}
      handleCloseCreateSheet={handleCloseCreateSheet}
      handleSubmit={handleSubmit}
      control={control}
      addSheet={addSheet}
    />
  )
}
