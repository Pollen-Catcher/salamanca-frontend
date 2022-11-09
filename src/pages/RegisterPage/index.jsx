import { Grid } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { SignUpForm } from '../../components/Forms'
import { UserContext } from '../../contexts/Auth/UserContext'

function RegisterPage() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user])
  return (
    <>
      <div className="flex h-[100vh] items-center justify-center bg-register bg-cover bg-scroll bg-center">
        <SignUpForm />
      </div>
    </>
  )
}

export default RegisterPage
