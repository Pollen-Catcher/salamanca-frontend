import GoogleIcon from '@mui/icons-material/Google'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

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
    <main
      id="login-form"
      className=" flex min-w-[26rem] flex-col justify-evenly rounded-lg p-8 sm:shadow-lg"
    >
      <header className="ml-6 flex flex-col items-start">
        <h2 className="my-2 text-6xl text-salamanca-blue-600">Salamanca</h2>
        <h3 className="text-base font-light text-zinc-400">
          Welcome! Enter your account to get started.
        </h3>
      </header>
      <form className=" flex w-full flex-col items-center justify-center ">
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
              color={'primary'}
              className=" my-2 w-[90%] py-2"
              label="Password"
              placeholder="Enter password"
            />
          )}
        />

        <div className="flex flex-row self-start">
          <Controller
            name="checkdB"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <FormControlLabel
                className="mx-4"
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
        <div className=" mt-4 flex w-full items-center justify-center">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className="w-[90%] text-2xl font-bold"
            onClick={handleSubmit(onSignIn)}
          >
            Login
          </Button>
        </div>
        <div className="flex w-[90%] items-center justify-between pt-8 text-sm text-zinc-500">
          <span>
            New user?
            <NavLink
              to={'/register'}
              className="font-semibold text-salamanca-blue-600 no-underline hover:mix-blend-darken"
            >
              <span> SignUp</span>
            </NavLink>
          </span>
          <span
            className="font-semibold hover:cursor-pointer hover:opacity-80 active:opacity-100"
            onClick={forgotPassword}
          >
            Forgot your password?
          </span>
        </div>
        <div className="relative w-[90%] pt-8">
          <div className="separator"></div>
        </div>
        <div className="flex w-[90%] items-center justify-around pt-4">
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            className="flex w-full justify-around px-6 text-lg font-semibold"
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            <span>Login with Google</span>
          </Button>
        </div>
      </form>
    </main>
  )
}
