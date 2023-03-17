import { Search } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Toolbar,
} from '@mui/material'
import { addDoc, doc, setDoc, collection } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'

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

export default () => {
  const [openCreateStation, setOpenCreateStation] = useState(false)

  const { handleSubmit, control } = useForm<FormValues>({ defaultValues })

  const onSubmit = handleSubmit((data) => createStation({ ...data }))

  return (
    <Paper className="container mx-auto max-w-4xl overflow-hidden">
      <Toolbar>
        <Box className="flex flex-grow flex-row items-center gap-4">
          <Search className="" />
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={'Name'}
                        variant={'outlined'}
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
                      />
                    )}
                    name="location"
                    control={control}
                  />
                </Box>
                <DialogActions
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button variant="contained" color={'primary'} type={'submit'}>
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
  )
}
