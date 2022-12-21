import { Timestamp } from 'firebase/firestore'

export class Sheet {
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

export const sheetConverter = {
  toFirestore: (sheet) => {
    return {
      name: sheet.name,
      location: sheet.location,
      createdAt: sheet.createdAt,
      lastEditedAt: sheet.lastEditedAt,
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
