import { AddCircle, Lock } from '@mui/icons-material'
import GoogleIcon from '@mui/icons-material/Google'
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
function Login({
  setRegisterEmail,
  setRegisterPassword,
  setLoginEmail,
  setLoginPassword,
  register,
  login,
  signInWithGoogle,
  forgotPassword,
  user,
}) {
  // Style

  const avatarStyle = { backgroundColor: '#108AC9' }
  const textStyle = { margin: '10px auto' }
  const buttonStyle = { margin: '10px auto' }

  return (
    <Grid container className="flex content-center justify-center py-4">
      {/*SIGN IN TAB*/}
      <Paper className="h-{70vh} mx-5 w-96 p-5">
        <Grid align="center" className="py-5">
          <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
            <Lock sx={{ width: 30, height: 30 }} />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <div className="py-2">
          <TextField
            className="py-2"
            label="Email"
            placeholder="Enter email"
            style={textStyle}
            onChange={(e) => setLoginEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            className="py-2"
            label="Password"
            placeholder="Enter password"
            style={textStyle}
            onChange={(e) => setLoginPassword(e.target.value)}
            type="password"
            fullWidth
            required
          />
        </div>
        <div className="formSignContainer">
          <div className="flex flex-row content-center justify-around">
            <FormControlLabel
              className="content-center justify-center"
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Typography>
              <div className="py-2">
                <Link href="#" onClick={forgotPassword}>
                  Forgot password ?
                </Link>
              </div>
            </Typography>
          </div>
          <div className="align-center flex flex-row justify-between px-5">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={login}
              style={buttonStyle}
            >
              Sign In
            </Button>
            {/* <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={logout}
              style={buttonStyle}
              fullWidth
            >
              Sign Out
            </Button>*/}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={signInWithGoogle}
              style={buttonStyle}
            >
              <GoogleIcon />
            </Button>
          </div>
        </div>
      </Paper>

      <h4>
        USER LOGGED IN:
        <p>{user?.email}</p>
      </h4>

      {/*SIGN UP TAB*/}
      <Paper className="h-{70vh} mx-5 w-96 p-5">
        <Grid align="center" className="py-5">
          <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
            <AddCircle sx={{ width: 30, height: 30 }} />
          </Avatar>
          <h2>Sign Up</h2>
        </Grid>
        <div className="py-2">
          <TextField
            className="py-2"
            label="Email"
            placeholder="Enter email"
            style={textStyle}
            onChange={(e) => setRegisterEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            className="py-2"
            label="Password"
            placeholder="Enter password"
            style={textStyle}
            onChange={(e) => setRegisterPassword(e.target.value)}
            type="password"
            fullWidth
            required
          />
        </div>
        <div className="align-center flex flex-row justify-center px-5 py-8">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={register}
          >
            Sign Up
          </Button>
        </div>
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
  signInWithGoogle: PropTypes.func,
  forgotPassword: PropTypes.func,
  user: PropTypes.object,
}

export default Login
