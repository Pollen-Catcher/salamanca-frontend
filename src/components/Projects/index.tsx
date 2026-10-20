import { Search } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Toolbar,
} from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { createStation } from '../../lib/station'
import Table from './Table'

const defaultValues = {
  name: '',
  location: '',
}

interface FormValues {
  name: string
  location: string
}

export default function Projects() {
  const [openCreateStation, setOpenCreateStation] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false) // ✅ CORRETO AGORA

  const { handleSubmit, control } = useForm<FormValues>({ defaultValues })

  const onSubmit = handleSubmit((data) => createStation({ ...data }))

  return (
    <>
      <Paper className="container mx-auto max-w-4xl overflow-hidden">
        <Toolbar>
          <Box className="flex flex-grow flex-row items-center gap-4">
            <Search />

            <TextField
              fullWidth
              placeholder="Search by name"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
              }}
              variant="standard"
              className="basis-1/2"
            />

            <Button
              variant="contained"
              onClick={() => setOpenCreateStation(true)}
              className="ml-auto"
            >
              Create New Project
            </Button>

            <Dialog
              open={openCreateStation}
              onClose={() => setOpenCreateStation(false)}
              disableEnforceFocus
            >
              <form onSubmit={onSubmit}>
                <DialogContent>
                  <DialogTitle textAlign={'center'}>
                    Create new station
                  </DialogTitle>

                  <Box className="flex flex-col gap-4">
                    <DialogContentText>
                      Fill in the fields below to generate a new work station
                    </DialogContentText>

                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Name" variant="outlined" />
                      )}
                    />

                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Location" variant="outlined" />
                      )}
                    />
                  </Box>

                  <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" type="submit">
                      Add Project
                    </Button>
                  </DialogActions>
                </DialogContent>
              </form>
            </Dialog>
          </Box>
        </Toolbar>

        <Table />
      </Paper>

      <Button
        variant="contained"
        onClick={() => setHelpOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 15,
          right: 20,
          borderRadius: '50%',
          minWidth: 0,
          width: 35,
          height: 35,
          fontSize: 18,
          zIndex: 1400,
        }}
      >
        ?
      </Button>

      {helpOpen && (
        <div
          onClick={() => setHelpOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: 30,
              borderRadius: 12,
              maxWidth: 500,
            }}
          >
            <h3>System Help</h3>

            <p>
              To create a new project, click on the “Create New Project” button.
              Then, enter your project name and location, and click “Add Project” to complete the process.
            </p>

            <p>
              After the project is created, click on the name in the table to access it.
            </p>

            <ul>
              <li><b>Edit:</b> Update the project’s name or location.</li>
              <li><b>Delete:</b> Permanently removes the project.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}