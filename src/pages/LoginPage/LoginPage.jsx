import { Grid } from '@mui/material'
import PropTypes from 'prop-types'

import { SignInForm, SignUpForm } from '../../components/Forms'

function Login({ signUp, login, signInWithGoogle, forgotPassword, user }) {
  // Style
  return (
    <Grid container className="flex content-center justify-center py-4">
      {/*SIGN IN TAB*/}
      <SignInForm
        forgotPassword={forgotPassword}
        login={login}
        signInWithGoogle={signInWithGoogle}
      />
      <div>
        <h4>USER LOGGED IN:</h4>
        <p>{user?.email}</p>
      </div>

      {/*SIGN UP TAB*/}
      <SignUpForm signUp={signUp} />
    </Grid>
  )
}

Login.propTypes = {
  signUp: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  signInWithGoogle: PropTypes.func,
  forgotPassword: PropTypes.func,
  user: PropTypes.object,
}

export default Login
