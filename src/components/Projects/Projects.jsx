import { Refresh, Search } from '@mui/icons-material'
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'

import { CreateSheetBox } from './styles'
import Table from './Table'

function Projects({
  openCreateSheet,
  handleOpenCreateSheet,
  handleCloseCreateSheet,
  handleSubmit,
  control,
  addSheet,
}) {
  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Search color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by name"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                onClick={handleOpenCreateSheet}
              >
                Create New Sheet
              </Button>
              <Dialog
                open={openCreateSheet}
                onClose={handleCloseCreateSheet}
                disableEnforceFocus
              >
                <form onSubmit={handleSubmit((data) => addSheet(data))}>
                  <DialogContent>
                    <DialogTitle>Type the sheet name</DialogTitle>
                    <CreateSheetBox>
                      <DialogContentText>
                        Fill in the fields below to generate a new work
                      </DialogContentText>
                      <Controller
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={'Name'}
                            variant={'outlined'}
                            sx={{
                              margin: '.5rem 0rem',
                            }}
                          />
                        )}
                        name="name"
                        control={control}
                      />
                      <Controller
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={'Location'}
                            variant={'outlined'}
                            sx={{
                              margin: '.5rem 0rem',
                            }}
                          />
                        )}
                        name="location"
                        control={control}
                      />
                    </CreateSheetBox>
                    <DialogActions
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        variant="contained"
                        color={'primary'}
                        type={'submit'}
                      >
                        Add Sheet
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </form>
              </Dialog>
              <Tooltip title="Reload">
                <IconButton>
                  <Refresh color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Table />
    </Paper>
  )
}

Projects.propTypes = {
  openCreateSheet: PropTypes.bool.isRequired,
  handleOpenCreateSheet: PropTypes.func.isRequired,
  handleCloseCreateSheet: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  addSheet: PropTypes.func.isRequired,
}

export default Projects
