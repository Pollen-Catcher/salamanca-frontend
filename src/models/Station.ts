import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore'

export interface Station {
  id: string
  name: string
  location: string
  userUid: string
  createdAt: Timestamp
  lastEditedAt: Timestamp
}

export const stationConverter: FirestoreDataConverter<Station> = {
  toFirestore: (station: WithFieldValue<Station>): DocumentData => {
    return {
      name: station.name,
      location: station.location,
      userUid: station.userUid,
      createdAt: station.createdAt,
      lastEditedAt: station.lastEditedAt,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Station => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      name: data.name,
      location: data.location,
      userUid: data.userUid,
      createdAt: data.createdAt,
      lastEditedAt: data.lastEditedAt,
    }
  },
}
