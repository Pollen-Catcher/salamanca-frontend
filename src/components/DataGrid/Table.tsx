import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'

import { columns } from '../../data/arrays'
import { Pollen } from '../../types/pollen'
import CustomToolbar from './CustomToolbar'
import Pagination from './Pagination'

interface Props {
  pollens: Pollen[]
}

export default function Table({ pollens }: Props) {
  return (
    <div className="container flex flex-1 content-center justify-center">
      <Box
        className="w-full"
        sx={{
          height: 540,
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
            '& .MuiDataGrid-columnHeaders': {
              fontSize: 16,
            },
            cursor: 'pointer',
          }}
          rows={pollens || []}
          columns={columns}
          pageSize={8}
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
