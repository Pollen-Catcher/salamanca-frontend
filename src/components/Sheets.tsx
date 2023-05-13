import { Box, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Speech, Datagrid } from '../components'

export default function Sheets() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const stringDate = date.toString()

  return (
    <Box className="flex flex-col items-center">
      <Box className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
        <Typography className="text-center font-sans text-lg font-medium">
          Click to Start Listening
        </Typography>
        <Speech date={stringDate} />
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
        value={date}
        onChange={(nv) => setDate(nv!)}
      />
      <Datagrid date={stringDate} />
    </Box>
  )
}
