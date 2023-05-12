import { Edit as EditIcon, Insights as InsightsIcon } from '@mui/icons-material'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'

import { getUsersStationRef } from '../../lib/station'
import { StyledTableCell, StyledTableRow } from './styles'

export default () => {
  const [stations, loading, error] = useCollectionData(getUsersStationRef())

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
                  <Link to={`${station.id}`}>
                    <EditIcon sx={{ color: '#202020' }} />
                  </Link>
                </TableCell>

                <TableCell align="center">
                  <Link to={`${station.id}/graph`}>{<InsightsIcon />}</Link>
                </TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
