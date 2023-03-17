import { Box, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment/moment'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Datagrid, Speech } from '../../components'
import { UserContext } from '../../contexts/Auth/UserContext'

export default function Sheets() {
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

  return (
    <Box className="flex flex-col items-center justify-center">
      <Box className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
        <Typography className="text-center font-sans text-lg font-medium text-zinc-800">
          Click to Start Listening
        </Typography>
        <Speech date={date} />
      </Box>

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
      <div className="mt-8 flex w-full">
        <Datagrid date={date} />
      </div>
    </Box>
  )
}
