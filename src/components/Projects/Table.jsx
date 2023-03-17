import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { collection, deleteDoc, doc } from 'firebase/firestore'
import { useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'

import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'
import { stationConverter } from '../../models/Station'
import { StyledTableCell, StyledTableRow } from './styles'

export default () => {
  const { db } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)

  const stationCollectionRef = collection(
    db,
    `users/${user?.uid}/stations`
  ).withConverter(stationConverter)
  const [stations, loading] = useCollectionData(stationCollectionRef)

  const deleteSheet = async (id) => {
    const currentRef = doc(db, `users/${user?.uid}/stations`, id)
    await deleteDoc(currentRef)
  }

  console.log(stations);

  return (
    <Box sx={{ color: 'black' }}>
      {loading || !stations?.length >= 1 ? (
        <Box className="flex justify-center">
          <Typography>No Projects found</Typography>
        </Box>
      ) : (
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>First Created</StyledTableCell>
              <StyledTableCell>Last Modified</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              stations.map((station) => {
                return (
                  <StyledTableRow key={station.name}>
                    <TableCell align="center">
                      <Link to={`${station.id}`}>{station.name}</Link>
                    </TableCell>
                    <TableCell align="center">{station.location}</TableCell>
                    <TableCell align="center">
                      {/* {new Date(
                        sheet.createdAt.seconds * 1000
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      })} */}
                    </TableCell>
                    <TableCell align="center">
                      {/* {new Date(
                        sheet.lastEditedAt.seconds * 1000
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      })} */}
                    </TableCell>

                    <TableCell align="center">
                      <Link to={`${station.id}`}>
                        <EditIcon sx={{ color: '#202020' }} />
                      </Link>
                    </TableCell>

                    <TableCell align="center">
                      <DeleteIcon
                        onClick={() => {
                          deleteSheet(station.id)
                        }}
                      />
                    </TableCell>
                  </StyledTableRow>
                )
              })}
          </TableBody>
        </Table>
      )}
    </Box>
  )
}
