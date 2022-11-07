import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
} from 'firebase/auth'
import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { FirebaseContext } from './firebaseContext'
export const UserContext = createContext({})

export function UserProvider({ children }) {
  const { auth } = useContext(FirebaseContext)
  const [authUser, loading] = useAuthState(auth)
  const [user, setUser] = useState(authUser)
  const location = useLocation()
  const navigate = useNavigate()

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })
  const signUp = async ({ email, password, confirmPassword }) => {
    console.log(email, password, confirmPassword)
    if (password !== confirmPassword) {
      throw new Error('Password and Password Confirmation must be the same')
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
    console.log(email, password, confirmPassword)
  }
  const signIn = async ({ email, password }) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      navigate('/', { replace: true })
      console.log(user)
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)
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
    user: user,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    forgotPassword: forgotPassword,
    signInWithGoogle: signInWithGoogle,
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
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
