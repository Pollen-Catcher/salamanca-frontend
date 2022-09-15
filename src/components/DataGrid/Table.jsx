import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'

import CustomToolbar from './CustomToolbar'
import Pagination from './Pagination'
const columns = [
  { field: 'name', headerName: 'Name', hideable: false },
  { field: '_0h', headerName: '0', width: 50 },
  { field: '_1h', headerName: '1', width: 50 },
  { field: '_2h', headerName: '2', width: 50 },
  { field: '_3h', headerName: '3', width: 50 },
  { field: '_4h', headerName: '4', width: 50 },
  { field: '_5h', headerName: '5', width: 50 },
  { field: '_6h', headerName: '6', width: 50 },
  { field: '_7h', headerName: '7', width: 50 },
  { field: '_8h', headerName: '8', width: 50 },
  { field: '_9h', headerName: '9', width: 50 },
  { field: '_10h', headerName: '10', width: 50 },
  { field: '_11h', headerName: '11', width: 50 },
  { field: '_12h', headerName: '12', width: 50 },
  { field: '_13h', headerName: '13', width: 50 },
  { field: '_14h', headerName: '14', width: 50 },
  { field: '_15h', headerName: '15', width: 50 },
  { field: '_16h', headerName: '16', width: 50 },
  { field: '_17h', headerName: '17', width: 50 },
  { field: '_18h', headerName: '18', width: 50 },
  { field: '_19h', headerName: '19', width: 50 },
  { field: '_20h', headerName: '20', width: 50 },
  { field: '_21h', headerName: '21', width: 50 },
  { field: '_22h', headerName: '22', width: 50 },
  { field: '_23h', headerName: '23', width: 50 },
]
function ExportCustomToolbar(pollens) {
  const rows = pollens.pollens.map((polen, index) => ({
    id: index,
    name: polen.name,
    ...polen.intervals,
  }))
  return (
    <div style={{ height: 'auto', width: 'auto' }}>
      <Box
        sx={{
          height: 540,
          width: 960,
          '& .MuiDataGrid-columnHeaders': {
            fontSize: 18,
            justifyContent: 'space-between',
            alignSelf: 'center',
          },
        }}
      >
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          rows={rows}
          columns={columns}
          pagination
          components={{
            Toolbar: CustomToolbar,
            Pagination: Pagination,
          }}
        />
      </Box>
    </div>
  )
}

export default ExportCustomToolbar
