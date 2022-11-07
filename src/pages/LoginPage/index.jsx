import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { FirebaseContext } from '../../contexts/firebaseContext'
import Login from './LoginPage'

export default () => {
  const { auth } = useContext(FirebaseContext)
  const [user, setUser] = useState({})
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
  const login = async ({ email, password }) => {
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

  const logout = async () => {
    await signOut(auth)
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

  return (
    <Login
      signUp={signUp}
      logout={logout}
      login={login}
      signInWithGoogle={signInWithGoogle}
      forgotPassword={forgotPassword}
      user={user}
    />
  )
}
