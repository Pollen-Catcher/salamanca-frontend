import {
  Box,
  Fab,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
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
  const [helpOpen, setHelpOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
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
              logOpen={logOpen}
              onLogOpenChange={(open) => {
                setLogOpen(open)
                if (open) setHelpOpen(false)
              }}
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

      {helpOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 216,
            width: { xs: 'calc(100vw - 48px)', sm: 300 },
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: '50vh',
            overflowY: 'auto',
            zIndex: (theme) => theme.zIndex.appBar - 1,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}
            >
              Instruções de Uso
            </Typography>
          </Box>
          <List dense sx={{ py: 0.5 }}>
            <ListItem sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                1. Clique em <strong>LISTEN</strong> para iniciar o reconhecimento de voz.
                <br />
                2. Fale os comandos ou dados desejados para registrar na tabela.
                <br />
                3. Alternativamente, selecione um arquivo <strong>CSV</strong> para
                importar os dados diretamente.
              </Typography>
            </ListItem>
          </List>
        </Paper>
      )}
      <Fab
        color="secondary"
        aria-label={helpOpen ? 'Fechar instruções de uso' : 'Abrir instruções de uso'}
        onClick={() => {
          setHelpOpen((previous) => !previous)
          setLogOpen(false)
        }}
        sx={{
          position: 'fixed',
          bottom: 152,
          right: 24,
          // Atrás do painel de log: quando ele abre, cobre esta posição.
          zIndex: (theme) => theme.zIndex.appBar - 2,
          boxShadow: 4,
        }}
      >
        <HelpOutlineIcon />
      </Fab>
    </Box>
  )
}
