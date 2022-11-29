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

/*******************************************************************************/
// Alguma coisa pro banco de dados do firebase mas eu não sei o que é

// connectFirestoreEmulator(db, 'localhost', 8080)
// connectAuthEmulator(auth, 'http://localhost:9099')

//                            By : Henrique
/*******************************************************************************/
export { FirebaseContext }
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
