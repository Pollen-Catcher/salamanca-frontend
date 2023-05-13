import { doc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function getUserRef(userUid: string) {
  return doc(db, `users/${userUid}`);
}
