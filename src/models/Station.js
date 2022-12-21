import { Timestamp } from 'firebase/firestore'

export class Station {
  constructor(name, location) {
    this.name = name
    this.location = location
    this.createdAt = Timestamp.now()
    this.lastEditedAt = this.createdAt
  }

  toString() {
    return `${this.name} - ${this.location}`
  }
}

export const stationConverter = {
  toFirestore: (station) => {
    return {
      name: station.name,
      location: station.location,
      createdAt: station.createdAt,
      lastEditedAt: station.lastEditedAt,
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      name: data.name,
      location: data.location,
      createdAt: data.createdAt,
      lastEditedAt: data.lastEditedAt,
    }
  },
}
