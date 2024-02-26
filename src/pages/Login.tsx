import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/UserContext'
import { SignInForm } from '../components/Forms'

export default function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user])
  
  return (
    <div className="flex h-[100vh] items-center justify-center ">
      <div className="hidden h-full min-w-[50vw] rounded-sm bg-salamanca-blue-600 bg-cover bg-center bg-no-repeat  sm:block sm:bg-research"></div>
      <div className="relative top-0 flex h-full min-w-[50%] flex-col items-center justify-center">
        <SignInForm />
      </div>
    </div>
  )
}
