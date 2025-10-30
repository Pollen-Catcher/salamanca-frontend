import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  Edit as EditIcon,
  Insights as InsightsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'

import {
  deleteStation,
  getUsersStationRef,
  updateStation,
} from '../../lib/station'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { StyledTableCell, StyledTableRow } from './styles'

export default () => {
  const [stations, loading, error] = useCollectionData(getUsersStationRef())
  const [editingStation, setEditingStation] = useState(null)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')

  function handleDelete(id) {
    if (!id) return
    const ok = window.confirm('Tem certeza que deseja deletar esta estação?')
    if (!ok) return
    deleteStation(id)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('station deleted', id)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('error deleting station', err)
        alert('Could not delete station')
      })
  }

  function openEditModal(station) {
    setEditingStation(station)
    setEditName(station.name || '')
    setEditLocation(station.location || '')
  }

  function closeEditModal() {
    setEditingStation(null)
    setEditName('')
    setEditLocation('')
  }

  function handleSaveEdit() {
    if (!editingStation) return
    updateStation(editingStation.id, { name: editName, location: editLocation })
      .then(() => {
        closeEditModal()
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('failed updating station', err)
        alert('Could not update station')
      })
  }

  if (loading)
    return (
      <Box className="flex justify-center">
        <Typography>Loading stations</Typography>
      </Box>
    )

  if (error)
    return (
      <Box className="flex justify-center">
        <Typography>Could not load stations</Typography>
      </Box>
    )

  if (stations.length === 0)
    return (
      <Box className="flex justify-center">
        <Typography>You do not have any stations</Typography>
      </Box>
    )

  return (
    <>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Location</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Generate graph</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stations.map((station) => {
            return (
              <StyledTableRow key={station.id}>
                <TableCell align="center">
                  <Link to={`${station.id}`}>{station.name}</Link>
                </TableCell>
                <TableCell align="center">{station.location}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => openEditModal(station)}>
                    <EditIcon sx={{ color: '#202020' }} />
                  </Button>
                </TableCell>

                <TableCell align="center">
                  <Link to={`${station.id}/graph`}>{<InsightsIcon />}</Link>
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() => handleDelete(station.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={!!editingStation} onClose={closeEditModal}>
        <DialogTitle>Edit station</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
