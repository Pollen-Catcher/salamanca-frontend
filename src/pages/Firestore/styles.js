import styled from "styled-components";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const TableContainer = styled.div`
  height: 700px;
  width: 100%;
`;

export const Flex = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  flex-grow: 1;
`;
