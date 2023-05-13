import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCbgFpToqAEvu5hh-_UMaTnZsOHcIooKgY',
  authDomain: 'salamanca-project.firebaseapp.com',
  projectId: 'salamanca-project',
  storageBucket: 'salamanca-project.appspot.com',
  messagingSenderId: '877270673339',
  appId: '1:877270673339:web:74ecff2033777387be869e',
  measurementId: 'G-DQLSW3H0MV',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// connectFirestoreEmulator(db, 'localhost', 8085)
// connectAuthEmulator(auth, 'http://localhost:9099')

export { app, auth, db }
