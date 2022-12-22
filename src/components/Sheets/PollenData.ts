import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore'
import { Pollen } from '../../types/pollen'

export const PollenDatagridConverter: FirestoreDataConverter<Pollen[]> = {
  toFirestore(data: WithFieldValue<Pollen[]>): DocumentData {
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
      ([key]) => key !== 'date' && key !== 'available'
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
