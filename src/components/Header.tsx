import { Notifications } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import { ProfileMenu } from '../components'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Calendário Polínico', to: '/dashboard/calendar' },
]

export default function Header() {
  const { pathname } = useLocation()

  const isActive = (to: string) =>
    to === '/dashboard/calendar'
      ? pathname.startsWith('/dashboard/calendar')
      : pathname !== '/dashboard/calendar' && pathname.startsWith('/dashboard')

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'secondary.main' }}>
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Grid item>
            <Typography variant="h5" component="h1">
              Pollen Catcher
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    sx={{
                      color: 'inherit',
                      textTransform: 'none',
                      borderRadius: 1,
                      px: 2,
                      fontWeight: isActive(item.to) ? 700 : 400,
                      bgcolor: isActive(item.to)
                        ? 'rgba(255,255,255,0.15)'
                        : 'transparent',
                      borderBottom: 3,
                      borderColor: isActive(item.to)
                        ? 'common.white'
                        : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Notifications />
                </IconButton>
              </Tooltip>
              <ProfileMenu />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
