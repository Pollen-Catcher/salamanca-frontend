import { Box, Skeleton, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { doc } from 'firebase/firestore'
import moment from 'moment/moment'
import { useContext, useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useNavigate, useParams } from 'react-router-dom'

import { Speech, Table } from '../../components'
import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { UserContext } from '../../contexts/Auth/UserContext'
import { PollenDatagridConverter } from './PollenData'

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

  const sheetRef = doc(
    db,
    'users',
    user.uid,
    'stations',
    sheetId,
    'days',
    date
  ).withConverter(PollenDatagridConverter)
  const [data, loading] = useDocumentData(sheetRef)
  console.log(data)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
        <Typography className=" text-center font-sans text-lg font-medium text-zinc-800">
          Click to Start Listening
        </Typography>
        <Speech pollens={data} sheetRef={sheetRef} />
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />

      <Typography
        className="flex content-center justify-center overflow-clip py-4"
        variant="h6"
        component="h6"
        sx={{ display: { xs: 'none', sm: 'block', color: '#b6b5b5' } }}
      >
        View and Edit
      </Typography>

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

      {loading ? (
        <Skeleton variant="rectangular" width={960} height={540}>
          <Table pollens={data} />
        </Skeleton>
      ) : (
        <div className="mt-8 flex w-full">
          <Table pollens={data} />
        </div>
      )}
    </div>
  )
}
