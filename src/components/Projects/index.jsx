import { addDoc, collection } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'
import { Station, stationConverter } from '../../models/Station'
import Projects from './Projects'

const defaultValues = {
  name: '',
  location: '',
}

export default () => {
  const { db } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)

  const [openCreateStation, setOpenCreateStation] = useState(false)
  const handleOpenCreateStation = () => setOpenCreateStation(true)
  const handleCloseCreateStation = () => setOpenCreateStation(false)

  const { handleSubmit, control } = useForm({ defaultValues })

  const addSheet = async (data) => {
    const { name, location } = data
    const station = new Station(name, location)
    await addDoc(
      collection(db, `users/${user?.uid}/stations`).withConverter(
        stationConverter
      ),
      station
    )
  }

  return (
    <Projects
      openCreateStation={openCreateStation}
      handleOpenCreateStation={handleOpenCreateStation}
      handleCloseCreateStation={handleCloseCreateStation}
      handleSubmit={handleSubmit}
      control={control}
      addSheet={addSheet}
    />
  )
}
