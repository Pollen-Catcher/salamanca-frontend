/* eslint-disable no-unused-vars */
import { Box, useTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/UserContext'
import { Copyright, Header } from '../components'

export default function Layout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}
        >
          <Outlet />
        </Box>
        <Copyright />
      </Box>
    </Box>
  )
}
