import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { useMemo } from 'react'

import { pollenCalendarData } from '../data/pollenCalendar'
import { pollensList } from '../data/arrays'

const monthLabels = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

const legendSwatch = {
  width: 16,
  height: 16,
  borderRadius: 1,
  border: 1,
  borderStyle: 'solid',
  borderColor: 'divider',
}

const MAX_POLLENS = pollensList.length
const data = new Map(pollenCalendarData.map((row) => [row.pollen, row.values]))

type CellColor = string | undefined

export default function PollensCalendar() {
  const theme = useTheme()

  const byPollen = useMemo(
    () =>
      pollensList
        .slice(0, MAX_POLLENS)
        .map((pollen) => data.get(pollen) ?? Array<number>(12).fill(0)),
    []
  )

  const cellColors = useMemo(
    () =>
      byPollen.map((months) => {
        const max = Math.max(...months)
        if (max <= 0) return Array<CellColor>(12).fill(undefined)
        return months.map((value) =>
          value <= 0
            ? undefined
            : value / max >= 0.5
              ? theme.palette.primary.main
              : theme.palette.secondary.main
        )
      }),
    [byPollen, theme.palette.primary.main, theme.palette.secondary.main]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Calendário Polínico
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ ...legendSwatch, backgroundColor: theme.palette.primary.main }} />
          <Typography variant="body2">Mais incidente</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ ...legendSwatch, backgroundColor: theme.palette.secondary.main }} />
          <Typography variant="body2">Menos incidente</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={legendSwatch} />
          <Typography variant="body2">Raro / sem registros</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: '100%', maxHeight: '75vh' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  backgroundColor: '#EAEFF1',
                  fontWeight: 700,
                }}
              >
                Pólen
              </TableCell>
              {monthLabels.map((month) => (
                <TableCell
                  key={month}
                  align="center"
                  sx={{ minWidth: 64, fontWeight: 700 }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pollensList.map((pollen, row) => {
              const max = Math.max(...byPollen[row])
              return (
                <TableRow key={pollen}>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pollen}
                  </TableCell>
                  {byPollen[row].map((value, month) => {
                    const color = cellColors[row][month]
                    return (
                      <TableCell
                        key={month}
                        align="center"
                        sx={{
                          backgroundColor: color,
                          color: color
                            ? color === theme.palette.primary.main
                              ? 'text.primary'
                              : '#FFFFFF'
                            : 'text.secondary',
                          fontWeight:
                            color === theme.palette.primary.main ? 700 : 400,
                        }}
                        title={
                          value > 0
                            ? `${pollen}: ${value} em ${monthLabels[month]}`
                            : `${pollen}: sem registros em ${monthLabels[month]}`
}></TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}