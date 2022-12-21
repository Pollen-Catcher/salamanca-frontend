import { Box, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { doc } from 'firebase/firestore'
import moment from 'moment/moment'
import { useContext, useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useNavigate, useParams } from 'react-router-dom'

import { Speech, Table } from '../../components'
import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'

export default () => {
  const { sheetId } = useParams()
  const { db } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [])

  const [date, setDate] = useState(moment().format('MM-DD-YYYY'))
  const handleChange = (newValue) => {
    setDate(newValue.format('MM-DD-YYYY'))
  }

  const pollenDocumentRef = doc(
    db,
    'users',
    user.uid,
    'stations',
    sheetId,
    'days',
    date
  )
  const [pollens] = useDocumentData(pollenDocumentRef)

  return (
    <>
      <div className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
        <Typography
          className=" text-center font-sans text-lg font-medium text-zinc-800"
          component="div"
        >
          Click to Start Listening
        </Typography>
        {/* <Speech pollens={pollens} sheetId={sheetId} /> */}
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      <Box className="flex justify-center py-4">
        <Typography
          className="flex content-center justify-center py-4"
          noWrap
          variant="h6"
          component="div"
          style={{ color: '#b6b5b5' }}
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          View and Edit
        </Typography>
      </Box>
      <DesktopDatePicker
        label="Sheet Date"
        className="flex w-full content-center justify-center py-4"
        inputFormat="MM/DD/YYYY"
        value={date}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            {...params}
          />
        )}
      />
      <Box className="flex w-full content-center justify-center py-4">
        {pollens && <Table pollens={pollens} />}
      </Box>
    </>
  )
}
