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
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { UserContext } from '../../../contexts/Auth/UserContext'

export const SignInForm = () => {
  const { signIn, signInWithGoogle, forgotPassword } = useContext(UserContext)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSignIn = (data) => {
    signIn({
      email: data.email,
      password: data.password,
    })
  }
  return (
    <main id="login-form" className=" flex flex-col justify-center  px-8">
      <header>
        <h1 className="my-2 text-6xl text-salamanca-blue-600">Login</h1>
        <h3 className="text-base font-light text-zinc-400">
          Welcome! Enter your account to get started.
        </h3>
      </header>
      <form>
        <div className="h-{70vh} w-96">
          <div className=" py-8">
            <Controller
              name="email"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  className=" my-2 w-[90%]"
                  {...field}
                  error={!!errors.email}
                  type={'email'}
                  label="E-mail"
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
                  error={!!errors.password}
                  type={'password'}
                  className=" my-2 w-[90%] py-2"
                  label="Password"
                  placeholder="Enter password"
                />
              )}
            />
          </div>

          <div className="flex flex-row">
            <Controller
              name="checkdB"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <FormControlLabel
                  className="px-4"
                  control={
                    <Checkbox {...field} color="primary" className="h-8 w-8" />
                  }
                  label={
                    <span className="text-sm text-zinc-400">Remember me</span>
                  }
                />
              )}
            />
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className="w-[90%] text-2xl font-bold"
              onClick={handleSubmit(onSignIn)}
            >
              Login
            </Button>
            {/* <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={signInWithGoogle}
            >
              <GoogleIcon />
            </Button> */}
          </div>
        </div>
      </form>
    </main>
  )
}
