import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
  updateProfile,
  User,
} from 'firebase/auth'
import { setDoc } from 'firebase/firestore'
import React, { createContext, useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router'
import { auth } from '../config/firebase'
import { getUserRef } from '../lib/user'

interface UserProviderProps {
  children: React.ReactNode
}

interface UserContextProps {
  user: User | undefined | null
  loading: boolean
  signUp: (props: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  signIn: (props: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  forgotPassword: (props: { email: string }) => Promise<void>
  signInWithGoogle: () => void
}

const UserContext = createContext<UserContextProps | null>(null)

export function UserProvider({ children }: UserProviderProps) {
  const [authUser, loading] = useAuthState(auth)
  const navigate = useNavigate()

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      localStorage.setItem('name', currentUser.displayName!)
      localStorage.setItem('email', currentUser.email!)
      localStorage.setItem('userID', currentUser.uid!)
    }
  })

  const signUp = async ({
    name,
    email,
    password,
    confirmPassword,
  }: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
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
        uid: user.uid,
      }
      await updateProfile(user, { displayName: name })
      await setDoc(getUserRef(user.uid), docData)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const signIn = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/', { replace: true })
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const signOut = async () => {
    await signOutFirebase(auth)
  }

  const forgotPassword = async ({ email }: { email: string }) => {
    await sendPasswordResetEmail(auth, email)
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        const docData = {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        }
        setDoc(getUserRef(user.uid), docData)
        navigate('/', { replace: true })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const userContextProps = {
    user: authUser,
    loading: loading,
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
    <UserContext.Provider value={userContextProps}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useContext(UserContext) as UserContextProps
