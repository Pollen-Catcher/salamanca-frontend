import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useState } from 'react'
import { useContext } from 'react'

import { FirebaseContext } from '../../contexts/firebaseContext'
import Login from './LoginPage'

export default () => {
  const { auth } = useContext(FirebaseContext)
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [user, setUser] = useState({})

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

  return (
    <Login
      setRegisterEmail={setRegisterEmail}
      setRegisterPassword={setRegisterPassword}
      setLoginEmail={setLoginEmail}
      setLoginPassword={setLoginPassword}
      register={register}
      logout={logout}
      login={login}
      forgotPassword={forgotPassword}
      user={user}
    />
  )
}
