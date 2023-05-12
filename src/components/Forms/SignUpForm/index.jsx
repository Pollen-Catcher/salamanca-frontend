import { yupResolver } from '@hookform/resolvers/yup'
import { Button, TextField } from '@mui/material'
import { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../../../contexts/Auth/UserContext'
import { schema } from './schema'
//styles??? Recomendo usar inline style com o tailwind
const textStyle = { margin: '10px auto' }

export const SignUpForm = () => {
  const { signUp } = useContext(UserContext)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  const onSignUp = (data) => {
    signUp({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
  }
  return (
    <main
      id="login-form"
      className=" flex min-w-[26rem] flex-col justify-evenly rounded-lg bg-white p-6 sm:shadow-lg"
    >
      <header className="ml-6 flex flex-col items-start">
        <h2 className="my-1 text-6xl text-salamanca-blue-600">Salamanca</h2>
        <h3 className="text-base font-light text-zinc-400">
          Create your account.
        </h3>
      </header>
      <form className=" flex min-h-[30rem] w-full flex-col items-center justify-between ">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              className=" mb-1 flex w-[90%] flex-col justify-start"
              {...field}
              error={!!errors.name}
              type={'text'}
              label="Name"
              placeholder="Enter your name"
              helperText={errors.name && errors?.name?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              className=" my-1 w-[90%]"
              {...field}
              error={!!errors.email}
              type={'email'}
              label="E-mail"
              placeholder="Enter email"
              helperText={errors.email && errors?.email?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.password}
              type={'password'}
              color={'primary'}
              className=" mt-1 w-[90%]"
              label="Password"
              placeholder="Enter password"
              helperText={errors.password && errors?.password?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              style={textStyle}
              type={'password'}
              error={!!errors.confirmPassword}
              className=" my-1 w-[90%]"
              label="Password confirmation"
              placeholder="Confirm your password"
              helperText={
                errors.confirmPassword && errors?.confirmPassword?.message
              }
            />
          )}
        />
        <div className="flex w-full  flex-col items-center">
          <div className=" mt-4 flex w-full items-center justify-center">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className="w-[90%] text-2xl font-bold"
              onClick={handleSubmit(onSignUp)}
            >
              Register
            </Button>
          </div>
          <div className="flex w-[90%] items-center justify-between pt-8 text-sm">
            <NavLink
              to={'/'}
              className="font-semibold text-zinc-500 no-underline hover:cursor-pointer hover:opacity-80 active:opacity-100"
            >
              <span>Already have a account?</span>
            </NavLink>
          </div>
          <div className="flex w-[90%] items-center justify-around pt-4"></div>
        </div>
      </form>
    </main>
  )
}
