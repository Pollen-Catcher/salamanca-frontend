/* eslint-disable no-unused-vars */
import { Box, Link, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'

import { Header } from '../../components'
import { UserContext } from '../../contexts/Auth/UserContext'
const Copyright = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        p: 2,
      }}
    >
      <Typography variant="body2" color="#b6b5b5" align="center">
        {'Copyright © '}
        <Link color="inherit" href="LINK AQUI">
          Pollen Catcher
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  )
}

export default function Layout() {
  // const drawerWidth = 256
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [])
  // const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  // const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#f0f0f0',
      }}
    >
      {/* <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box> */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}
        >
          <Outlet />
        </Box>
        <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  )
}
