import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore'
import { Pollen, PollenDatagrid } from '../../types/pollen'

export const PollenDatagridConverter: FirestoreDataConverter<PollenDatagrid[]> =
  {
    toFirestore(data: WithFieldValue<PollenDatagrid[]>): DocumentData {
      return { ...data }
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): PollenDatagrid[] {
      const data = snapshot.data(options)
      return Object.entries(data).map(([key, value]) => ({
        id: key,
        name: key,
        dailySum: Object.values(value).reduce((a, b) => a + b, 0),
        ...(value as Pollen),
      }))
    },
  }
