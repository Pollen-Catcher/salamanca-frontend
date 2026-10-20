import { Box, Typography, Accordion, AccordionSummary,AccordionDetails } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Speech, Datagrid, PollensList } from '../components'
import CSVReader from 'react-csv-reader'
import { PollenCsvInput } from '../types/pollen'
import { csvToFirestore, getDaysByStationRef } from '../lib/sheet'
import { useParams } from 'react-router'
import { query, where } from 'firebase/firestore'
import { auth } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CommandBar from './CommandBar'

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}

const dotSx = {
  position: 'absolute',
  bottom: '2px',
  width: 5,
  height: 5,
  borderRadius: '50%',
  bgcolor: 'primary.main',
} as const

const createDayWithDot = (datesWithData: Set<string>) =>
  function DayWithDot(props: PickersDayProps<Dayjs>) {
    const { day: dayValue, ...other } = props
    const hasData = datesWithData.has(dayValue.format('YYYY-MM-DD'))
    return (
      <PickersDay day={dayValue} {...other} sx={{ position: 'relative' }}>
        {dayValue.format('D')}
        {hasData && <Box component="span" sx={dotSx} />}
      </PickersDay>
    )
  }

export default function Sheets() {
  const { sheetId } = useParams()
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [currentHour, setCurrentHour] = useState(0)
  const stringDate = date.format('YYYY-MM-DD')
  const [highlight, setHighlight] = useState<{
    id: string
    field: string
    ts: number
  } | null>(null)
  const [user] = useAuthState(auth)
  const [daysSnap] = useCollection(
    sheetId && user
      ? query(getDaysByStationRef(sheetId), where('userUid', '==', user.uid))
      : null
  )
  const datesWithData = useMemo(
    () => new Set((daysSnap?.docs ?? []).map((d) => d.id)),
    [daysSnap]
  )

  return (
    <Box className="flex flex-col items-center">
      <Box className="my-3 w-full max-w-[24rem]">
        <Accordion sx={{ boxShadow: 1, borderRadius: '8px', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="instrucoes-content"
            id="instrucoes-header"
          >
            <Typography variant="h6" className="font-semibold text-gray-800">
              Instruções de Uso
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" className="text-gray-600">
              1. Clique em <strong>LISTEN</strong> para iniciar o reconhecimento de voz.<br />
              2. Fale os comandos ou dados desejados para registrar na tabela.<br />
              3. Alternativamente, selecione um arquivo <strong>CSV</strong> para importar os dados diretamente.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) auto' },
          alignItems: 'stretch',
          gap: 1.5,
          width: '100%',
          minWidth: 0,
        }}
      >
        <Box className="flex min-w-0 flex-col items-center">
          <Box className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
            <Typography className="text-center font-sans text-lg font-medium">
              Click to start listening
            </Typography>
            <Speech
              date={stringDate}
              currentHour={currentHour}
              onHourChange={setCurrentHour}
              onCommit={(pollen, interval) =>
                setHighlight({ id: pollen, field: interval, ts: Date.now() })
              }
            />
            <CommandBar
              date={stringDate}
              currentHour={currentHour}
              onHourChange={setCurrentHour}
            />
            <CSVReader
              parserOptions={papaparseOptions}
              onFileLoaded={(data: PollenCsvInput[]) =>
                csvToFirestore(data, sheetId!)
              }
            />
          </Box>
          <Typography
            className="flex content-center justify-center overflow-clip py-4"
            variant="h6"
            component="h6"
            sx={{ display: { xs: 'none', sm: 'block', color: '#b6b5b5' } }}
          >
            View and edit
          </Typography>
          <DesktopDatePicker
            label="Sheet Date"
            className="flex w-full content-center justify-center py-4"
            value={date}
            onChange={(nv) => setDate(nv!)}
            slots={{ day: createDayWithDot(datesWithData) }}
          />
          <Box className="w-full min-w-0">
            <Datagrid date={stringDate} highlight={highlight} />
          </Box>
        </Box>
        <PollensList />
      </Box>
    </Box>
  )
}
