import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid'

export default function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        boxShadow: 2,
        border: 2,
        borderColor: 'primary.light',
        backgroundColor: 'primary.light',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <GridToolbarExport
        sx={{
          color: 'white',
        }}
      />
      <GridToolbarColumnsButton
        sx={{
          color: 'white',
        }}
      />
      <GridToolbarQuickFilter
        sx={{
          color: 'white',
          borderColor: 'white',
        }}
      />
    </GridToolbarContainer>
  )
}
