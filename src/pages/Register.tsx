import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/UserContext'
import { SignUpForm } from '../components/Forms'

export default function Register() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user])

  return (
    <div className="flex h-[100vh] items-center justify-center bg-register bg-cover bg-scroll bg-center">
      <SignUpForm />
    </div>
  )
}
