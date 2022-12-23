import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

interface PollenGraphData {
  name: string
  date: string
  dailySum: any
}

export const PollenDatagridConverter: FirestoreDataConverter<
  PollenGraphData[]
> = {
  toFirestore(data: PollenGraphData[]): DocumentData {
    return data
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PollenGraphData[] {
    const data = snapshot.data(options)
    const pollens = Object.entries(data).filter(
      ([key]) => key !== 'available' && key !== 'date'
    )
    return pollens.map(([key, value]) => {
      const pollen: PollenGraphData = {
        name: key,
        date: snapshot.id,
        dailySum: Object.values(value).reduce((acc, curr) => acc + curr, 0),
      }
      return pollen
    })
  },
}
