import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import PropTypes from 'prop-types'
import { createContext, useContext } from 'react'

import { firebaseConfig } from '../../config/firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const FirebaseContext = createContext({ app, db, auth })

connectFirestoreEmulator(db, 'localhost', 8085)
connectAuthEmulator(auth, 'http://localhost:9099')

export function AuthProvider({ children }) {
  const { auth, db } = useContext()

  return (
    <FirebaseContext.Provider value={{ db, auth }}>
      {children}
    </FirebaseContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export { app, auth, db, FirebaseContext }
