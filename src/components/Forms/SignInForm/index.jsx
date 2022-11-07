import { Lock } from '@mui/icons-material'
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
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const avatarStyle = { backgroundColor: '#108AC9' }
const textStyle = { margin: '10px auto' }
const buttonStyle = { margin: '10px auto' }
export const SignInForm = ({ login, signInWithGoogle, forgotPassword }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSignIn = (data) => {
    login({
      email: data.email,
      password: data.password,
    })
  }
  return (
    <Paper className="h-{70vh} mx-5 w-96 p-5">
      <Grid align="center" className="py-5">
        <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
          <Lock sx={{ width: 30, height: 30 }} />
        </Avatar>
        <h2>Sign in</h2>
      </Grid>
      <div className="py-2">
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              style={textStyle}
              fullWidth
              error={!!errors.email}
              aria-errormessage={errors?.email?.message}
              type={'email'}
              className="py-2"
              label="Email"
              placeholder="Enter email"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              style={textStyle}
              fullWidth
              error={!!errors.password}
              aria-errormessage={errors?.password?.message}
              type={'password'}
              className="py-2"
              label="password"
              placeholder="Enter password"
            />
          )}
        />
      </div>
      <div className="formSignContainer">
        <div className="flex flex-row content-center justify-around">
          <Controller
            name="checkdB"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <FormControlLabel
                className="content-center justify-center"
                control={<Checkbox {...field} color="primary" />}
                label="Remember me"
              />
            )}
          />

          <div className="py-2">
            <Typography>
              <Link href="#" onClick={forgotPassword}>
                Forgot password ?
              </Link>
            </Typography>
          </div>
        </div>
        <div className="align-center flex flex-row justify-between px-5">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSignIn)}
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
  )
}
SignInForm.propTypes = {
  login: PropTypes.func,
  signInWithGoogle: PropTypes.func,
  forgotPassword: PropTypes.func,
}
