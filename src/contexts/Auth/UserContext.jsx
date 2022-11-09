import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import PropTypes from 'prop-types'
import { createContext, useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router'

import { FirebaseContext } from './firebaseContext'

export const UserContext = createContext({})

export function UserProvider({ children }) {
  const { auth } = useContext(FirebaseContext)
  const { db } = useContext(FirebaseContext)
  const [authUser, loading] = useAuthState(auth)
  const navigate = useNavigate()

  onAuthStateChanged(auth, (currentUser) => {
    localStorage.setItem('name', currentUser?.displayName)
    localStorage.setItem('email', currentUser?.email)
    localStorage.setItem('userID', currentUser?.uid)
  })
  const signUp = async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      throw new Error('Password and Password Confirmation must be the same')
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const docData = {
        name: name,
        email: user.email,
      }
      console.log(docData)
      await updateProfile(user, { displayName: name })
      await setDoc(doc(db, 'users', user.uid), docData)
    } catch (error) {
      console.log(error.message)
    }
  }
  const signIn = async ({ email, password }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      console.log(user)
      localStorage.setItem('name', user.displayName)
      localStorage.setItem('email', email.email)
      localStorage.setItem('userID', user.uid)
      navigate('/', { replace: true })
    } catch (error) {
      console.log(error.message)
    }
  }

  const signOut = async () => {
    await signOutFirebase(auth)
  }

  const forgotPassword = async ({ email }) => {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password Sent' + email)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const name = result.user.displayName
        const email = result.user.email
        const profilePic = result.user.photoURL
        console.log(result)

        localStorage.setItem('name', name)
        localStorage.setItem('email', email)
        localStorage.setItem('profilePic', profilePic)
        navigate('/', { replace: true })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const userProviderProps = {
    user: authUser,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    forgotPassword: forgotPassword,
    signInWithGoogle: signInWithGoogle,
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <UserContext.Provider value={userProviderProps}>
      {children}
    </UserContext.Provider>
  )
}
UserProvider.propTypes = {
  children: PropTypes.node,
}
