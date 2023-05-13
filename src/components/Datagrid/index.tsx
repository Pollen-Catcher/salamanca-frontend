import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router'

import { columns } from '../../data/arrays'
import { getSheetDateRef } from '../../lib/sheet'
import CustomToolbar from './CustomToolbar'
import Pagination from './Pagination'

interface TableProps {
  date: string
}

export default function Datagrid({ date }: TableProps) {
  const { sheetId } = useParams()
  const [pollens] = useDocumentData(getSheetDateRef(sheetId!, date))

  return (
    <Box className="h-[400px]">
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          '& .MuiDataGrid-columnHeaders': {
            fontSize: 16,
          },
          cursor: 'pointer',
        }}
        rows={pollens || []}
        getRowId={(row) => row.name}
        columns={columns}
        // pageSize={8}
        pagination
        components={{
          Toolbar: CustomToolbar,
          Pagination: Pagination,
        }}
      />
    </Box>
  )
}
