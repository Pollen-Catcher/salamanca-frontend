import { Grid } from '@mui/material'
import { useContext, useEffect } from 'react'

import { SignUpForm } from '../../components/Forms'
import { UserContext } from '../../contexts/Auth/UserContext'

function RegisterPage() {
  const { user } = useContext(UserContext)
  useEffect(() => {
    console.log(user)
  }, [user])
  return (
    <Grid container className="flex content-center justify-center py-4">
      <SignUpForm />
    </Grid>
  )
}

export default RegisterPage
