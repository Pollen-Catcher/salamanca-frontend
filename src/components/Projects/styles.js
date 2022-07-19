import {
  Box,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material'

export const CreateSheetBox = styled(Box)`
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3px;
`

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#108AC9',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  fontWeight: 'bold',
  textAlign: 'center',
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    width: '100%',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
