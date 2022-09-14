import { AddCircle, Lock } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

import { signInWithGoogle } from '../../config/firebase'

function Login({
  setRegisterEmail,
  setRegisterPassword,
  setLoginEmail,
  setLoginPassword,
  register,
  logout,
  login,
  forgotPassword,
  user,
}) {
  // Style
  const paperStyle = {
    padding: 20,
    height: '70vh',
    width: 360,
    margin: '20px auto',
  }
  const avatarStyle = { backgroundColor: '#108AC9' }
  const textStyle = { margin: '10px auto' }
  const buttonStyle = { margin: '10px auto' }

  return (
    <Grid container>
      {/*SIGN IN TAB*/}
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
            <Lock sx={{ width: 30, height: 30 }} />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter email"
          style={textStyle}
          onChange={(e) => setLoginEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          placeholder="Enter password"
          style={textStyle}
          onChange={(e) => setLoginPassword(e.target.value)}
          type="password"
          fullWidth
          required
        />
        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" />}
          label="Remember me"
        />
        <Typography>
          <Link href="#" onClick={forgotPassword}>
            {' '}
            Forgot password ?
          </Link>
        </Typography>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={login}
          style={buttonStyle}
          fullWidth
        >
          Sign In
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={logout}
          style={buttonStyle}
          fullWidth
        >
          Sign Out
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={signInWithGoogle}
          style={buttonStyle}
          fullWidth
        >
          Sign In with Google{' '}
        </Button>
      </Paper>

      <h4>
        USER LOGGED IN:
        <p>{user?.email}</p>
      </h4>

      {/*SIGN UP TAB*/}
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
            <AddCircle sx={{ width: 30, height: 30 }} />
          </Avatar>
          <h2>Sign Up</h2>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter email"
          style={textStyle}
          onChange={(e) => setRegisterEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          placeholder="Enter password"
          style={textStyle}
          onChange={(e) => setRegisterPassword(e.target.value)}
          type="password"
          fullWidth
          required
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={register}
          fullWidth
        >
          Sign Up
        </Button>
      </Paper>
    </Grid>
  )
}

Login.propTypes = {
  setRegisterEmail: PropTypes.func,
  setRegisterPassword: PropTypes.func,
  setLoginEmail: PropTypes.func,
  setLoginPassword: PropTypes.func,
  register: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  forgotPassword: PropTypes.func,
  user: PropTypes.object,
}

export default Login
