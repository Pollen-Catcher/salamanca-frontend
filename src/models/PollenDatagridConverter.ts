import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import { Pollen } from '../types/pollen'

const PollenDatagridConverter: FirestoreDataConverter<Pollen[]> = {
  toFirestore(data: any): DocumentData {
    return {
      ...data,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Pollen[] {
    const data = snapshot.data(options)
    const pollens = Object.entries(data).filter(
      ([key]) => key !== 'date' && key !== 'available' && key !== 'userUid' && key !== 'station'
    )
    return pollens.map(([key, value]) => {
      const pollen: Pollen = {
        name: key,
        ...value,
      }
      return pollen
    })
  },
}

export default PollenDatagridConverter;
