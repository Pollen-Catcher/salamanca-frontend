import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  CollectionReference,
  query,
  where,
  Timestamp,
  Query,
  getFirestore,
} from 'firebase/firestore'
import { app } from '../config/firebase'
import { Station, stationConverter } from '../models/Station'

interface StationDto {
  name: string
  location: string
}

const auth = getAuth(app)
const db = getFirestore(app)
export function getStationsRef(): CollectionReference<Station> {
  return collection(db, 'stations').withConverter(stationConverter)
}

export function getUsersStationRef(): Query<Station> | null {
  const ref = getStationsRef()
  if (auth.currentUser)
    return query(ref, where('userUid', '==', auth.currentUser?.uid))
  else return null
}

export async function createStation({ name, location }: StationDto) {
  const userUid = auth.currentUser?.uid
  if (!userUid) return

  const station = {
    name,
    location,
    userUid,
    createdAt: Timestamp.now(),
    lastEditedAt: Timestamp.now(),
  }
  const ref = getStationsRef()
  await addDoc(ref, station)
}

export async function deleteStation(id: string) {
  if (!id) return
  try {
    const { deleteDoc, doc } = await import('firebase/firestore')
    const dbRef = doc(getFirestore(app), 'stations', id)
    await deleteDoc(dbRef)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('failed to delete station', err)
    throw err
  }
}

export async function updateStation(id: string, data: Partial<StationDto>) {
  if (!id) return
  try {
    const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore')
    const dbRef = doc(getFirestore(app), 'stations', id)
    await updateDoc(dbRef, {
      ...data,
      lastEditedAt: serverTimestamp(),
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('failed to update station', err)
    throw err
  }
}
