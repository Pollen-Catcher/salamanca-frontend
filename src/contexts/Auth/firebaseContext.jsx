import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import PropTypes from 'prop-types'
import { createContext, useContext } from 'react'

import { firebaseConfig } from '../../config/firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const FirebaseContext = createContext({ app, db, auth })

//connectFirestoreEmulator(db, 'localhost', 8085)     you have to add this if you want to connect to the database via emulators
//connectAuthEmulator(auth, 'http://localhost:9099')  you have to add this if you want to emulators providing authentication

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
