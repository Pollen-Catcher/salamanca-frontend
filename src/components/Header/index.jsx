import { Help, Notifications } from '@mui/icons-material'
import {
  AppBar,
  // Avatar,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

import Breadcrumbs from '../Breadcrumbs'
import { ProfileMenu } from '../ProfileMenu/'
function Header({ onDrawerToggle }) {
  return (
    <>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent={'flex-end'}
          >
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <Notifications />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <ProfileMenu />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Pollen Catcher
              </Typography>
            </Grid>
            <Grid item xs>
              <Breadcrumbs />
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <Help />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
}

export default Header
