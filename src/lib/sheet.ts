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
  writeBatch,
  deleteDoc,
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { Pollen, PollenCsvInput } from '../types/pollen'
import {
  PollenGraphData,
  PollenDatagridConverter as PollenConverter,
} from '../components/Graph/PollenData'
import PollenDatagridConverter from '../models/PollenDatagridConverter'

interface CreateDayDto {
  sheetId: string
  date: string
  pollen: string
  interval: string
  amount: number
}

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

export async function csvToFirestore(data: PollenCsvInput[], sheetId: string) {
  const uid = auth.currentUser?.uid
  if (!uid) return

  const batch = writeBatch(db)

  for (const { date, name, interval, amount } of data) {
    const sheetRef = doc(db, `stations/${sheetId}/days/${date}`)
    let selection: any = {}
    selection[`_${interval}h`] = increment(amount)
    batch.set(
      sheetRef,
      {
        available: arrayUnion(name),
        [name]: selection,
        userUid: uid,
        station: sheetId,
        date: date
      },
      { merge: true }
    )
  }

  await batch.commit()
}

export function getPollensByStation(
  sheetIds: string[] | undefined
): Query<PollenGraphData[]> | null {
  const userUid = auth.currentUser?.uid
  if (!userUid || !sheetIds) return null

  const daysRef = collectionGroup(db, 'days').withConverter(PollenConverter)
  const q = query(
    daysRef,
    where('userUid', '==', userUid),
    where('station', 'in', sheetIds)
  )

  return q
}

export async function deleteSheet(sheetId: string) {
  const db = getFirestore();
  const ref = doc(db, "sheets", sheetId);
  await deleteDoc(ref);
}
