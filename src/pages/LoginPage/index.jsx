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
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [user, setUser] = useState({})

  const navigate = useNavigate()

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      )
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      )
      navigate('/', { replace: true })
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const forgotPassword = async () => {
    await sendPasswordResetEmail(auth, loginEmail)
      .then(() => {
        console.log('Password Sent' + loginEmail)
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
      setRegisterEmail={setRegisterEmail}
      setRegisterPassword={setRegisterPassword}
      setLoginEmail={setLoginEmail}
      setLoginPassword={setLoginPassword}
      register={register}
      logout={logout}
      login={login}
      signInWithGoogle={signInWithGoogle}
      forgotPassword={forgotPassword}
      user={user}
    />
  )
}
