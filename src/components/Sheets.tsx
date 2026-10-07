import { Box, Typography, Accordion, AccordionSummary,AccordionDetails } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Speech, Datagrid } from '../components'
import CSVReader from 'react-csv-reader'
import { PollenCsvInput } from '../types/pollen'
import { csvToFirestore } from '../lib/sheet'
import { useParams } from 'react-router'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CommandBar from './CommandBar'

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}

export default function Sheets() {
  const { sheetId } = useParams()
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [currentHour, setCurrentHour] = useState(0)
  const stringDate = date.format('YYYY-MM-DD')

  return (
      <Box className="flex flex-col items-center">

      {/* NOVO BLOCO: Título clicável com explicação expansível */}
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

      <Box className="my-2 flex min-h-[10rem] min-w-[24rem] flex-col items-center justify-evenly rounded-lg shadow-md">
        <Typography className="text-center font-sans text-lg font-medium">
          Click to start listening
        </Typography>
        <Speech
          date={stringDate}
          currentHour={currentHour}
          onHourChange={setCurrentHour}
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
      />
      <Datagrid date={stringDate} />
    </Box>
  )
}
