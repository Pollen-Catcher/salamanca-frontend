import { Grid } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { SignInForm } from '../../components/Forms'
import { UserContext } from '../../contexts/Auth/UserContext'
function Login() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  // Style
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [])
  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Grid className="hidden h-[100vh] w-[50%] bg-cover bg-center sm:block sm:bg-research"></Grid>
      <div className="flex w-[50%] flex-col justify-center">
        {/*SIGN IN TAB*/}
        <div className="flex content-center items-center justify-center">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
export default Login
