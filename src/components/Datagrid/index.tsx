import { alpha } from '@mui/material/styles'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router'

import { columns } from '../../data/arrays'
import { getSheetDateRef } from '../../lib/sheet'
import CustomToolbar from './CustomToolbar'
import Pagination from './Pagination'

interface TableProps {
  date: string
  highlight?: { id: string; field: string; ts: number } | null
}

export default function Datagrid({ date, highlight }: TableProps) {
  const { sheetId } = useParams()
  const [pollens] = useDocumentData(getSheetDateRef(sheetId!, date))
  const [selected, setSelected] = useState<{
    id: string
    field: string
  } | null>(null)

  useEffect(() => {
    if (highlight) setSelected({ id: highlight.id, field: highlight.field })
  }, [highlight])

  const selField = selected?.field ? `[data-field="${selected.field}"]` : ''

  return (
    <Box className="h-[400px] w-full min-w-0 overflow-hidden">
      <DataGrid
        sx={{
          minWidth: 0,
          width: '100%',
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          '& .MuiDataGrid-columnHeaders': {
            fontSize: 16,
          },
          '& .grid-row--selected': {
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.light, 0.5),
          },
          ...(selField && {
            [`& ${selField}.MuiDataGrid-cell`]: {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.16),
            },
            [`& ${selField}.MuiDataGrid-columnHeader`]: {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.38),
              fontWeight: 700,
            },
          }),
          '& .grid-cell--selected': {
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.6),
            fontWeight: 700,
          },
          cursor: 'pointer',
        }}
        rows={pollens || []}
        getRowId={(row) => row.name}
        columns={columns}
        onCellClick={(params) => setSelected({ id: String(params.id), field: params.field })}
        getCellClassName={(params) =>
          selected &&
          params.id === selected.id &&
          params.field === selected.field
            ? 'grid-cell--selected'
            : ''
        }
        getRowClassName={(params) =>
          selected && params.id === selected.id ? 'grid-row--selected' : ''
        }
        pagination
        components={{
          Toolbar: CustomToolbar,
          Pagination: Pagination,
        }}
      />
    </Box>
  )
}
