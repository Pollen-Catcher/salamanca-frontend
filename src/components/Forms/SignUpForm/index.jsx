import { AddCircle } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { UserContext } from '../../../contexts/Auth/UserContext'
//styles??? Recomendo usar inline style com o tailwind
const textStyle = { margin: '10px auto' }
const avatarStyle = { backgroundColor: '#108AC9' }

export const SignUpForm = () => {
  const { signUp } = useContext(UserContext)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const onSignUp = (data) => {
    signUp({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
  }
  return (
    <form>
      <Paper className="h-{70vh} mx-5 w-96 p-5">
        <Grid align="center" className="py-5">
          <Avatar style={avatarStyle} sx={{ width: 56, height: 56 }}>
            <AddCircle sx={{ width: 30, height: 30 }} />
          </Avatar>
          <h2>Sign Up</h2>
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
                required
                error={!!errors.email}
                onError={() => console.log(errors?.email?.message)}
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
                required
                type={'password'}
                error={!!errors.password}
                onError={() => console.log(errors?.password?.message)}
                className="py-2"
                label="password"
                placeholder="Enter password"
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                style={textStyle}
                fullWidth
                required
                type={'password'}
                className="py-2"
                label="Password confirmation"
                placeholder="Confirm your password"
              />
            )}
          />
        </div>
        <div className="align-center flex flex-row justify-center px-5 py-8">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSignUp)}
          >
            Sign Up
          </Button>
        </div>
        <div className="flex items-center justify-center py-2">
          <Typography className="px-2">Already have a account?</Typography>
          <Link href="#">Sign in</Link>
        </div>
      </Paper>
    </form>
  )
}
