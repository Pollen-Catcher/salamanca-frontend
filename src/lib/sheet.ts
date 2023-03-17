import { getAuth } from 'firebase/auth'
import {
  DocumentReference,
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  setDoc,
  FirestoreError,
  collectionGroup,
  where,
  query,
  Query,
} from 'firebase/firestore'
import { app } from '../contexts/Auth/firebaseContext'
import PollenDatagridConverter from '../models/PollenDatagridConverter'
import { Pollen } from '../types/pollen'

interface CreateDayDto {
  sheetId: string
  date: string
  pollen: string
  interval: string
  amount: number
}

const db = getFirestore(app)
const auth = getAuth(app)

export function getSheetDateRef(
  stationId: string,
  date: string
): DocumentReference<Pollen[]> {
  return doc(db, `stations/${stationId}/days/${date}`).withConverter(
    PollenDatagridConverter
  )
}

export async function publishPollen({
  pollen,
  interval,
  amount,
  sheetId,
  date,
}: CreateDayDto) {
  const uid = auth.currentUser?.uid
  if (!uid) return

  const sheetRef = doc(db, `stations/${sheetId}/days/${date}`)
  await updateDoc(sheetRef, {
    available: arrayUnion(pollen),
    [`${pollen}.${interval}`]: increment(amount),
    userUid: uid,
  }).catch(async (e: FirestoreError) => {
    if (e.code === 'not-found') {
      await setDoc(sheetRef, {
        date: date,
        available: [pollen],
        [pollen]: {
          [interval]: Math.abs(amount),
        },
        userUid: uid,
        station: sheetId,
      })
    }
  })
}

export function getPollensByStation(sheetIds: string[]): Query<Pollen[]> | null {
  const userUid = auth.currentUser?.uid
  if (!userUid) return null

  const daysRef = collectionGroup(db, 'days').withConverter(
    PollenDatagridConverter
  )
  const q = query(
    daysRef,
    where('userUid', '==', userUid),
    where('station', 'in', sheetIds)
  )

  return q
}