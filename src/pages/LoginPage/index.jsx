import { Grid } from '@mui/material'
import { useContext } from 'react'

import { SignInForm, SignUpForm } from '../../components/Forms'
import { UserContext } from '../../contexts/Auth/UserContext'
function Login() {
  const { user } = useContext(UserContext)
  // Style
  return (
    <Grid container className="flex content-center justify-center py-4">
      {/*SIGN IN TAB*/}
      <SignInForm />
      <div>
        <h4>USER LOGGED IN:</h4>
        <p>{user?.email}</p>
      </div>

      {/*SIGN UP TAB*/}
      <SignUpForm />
    </Grid>
  )
}
export default Login
