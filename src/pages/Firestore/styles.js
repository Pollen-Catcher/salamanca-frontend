import styled from "styled-components";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const Wrapper = styled.div``;

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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
  align: center;
  flex-grow: 1;
`;
