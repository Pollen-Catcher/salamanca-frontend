import { Timestamp } from 'firebase/firestore'

export class User {
  constructor(uid, name, displayName) {
    this.uid = uid
    this.name = name
    this.displayName = displayName
    this.createdAt = Timestamp.now()
  }

  toString() {
    return this.name
  }
}

export const userConverter = {
  toFirestore: (user) => {
    return {
      user,
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      ...data,
    }
  },
}
