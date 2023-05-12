/* eslint-disable no-unused-vars */
import { Box, useTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Outlet, useNavigate } from 'react-router-dom'

import { Header } from '../../components'
import { Copyright } from '../../components/Copyright'
import { UserContext } from '../../contexts/Auth/UserContext'
import { getPollensByStation } from '../../lib/sheet'

export default function Layout() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true })
    }
  }, [])

  const [pollens, loading, error] = useCollectionData(
    getPollensByStation(['wbOHY7gupZThn4hRU3L4'])
  )
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
        <footer>
          <Copyright />
        </footer>
      </Box>
    </Box>
  )
}
