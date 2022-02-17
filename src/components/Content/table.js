import * as React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import { collection, doc, deleteDoc } from "firebase/firestore";
import db from "../../config/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Crud() {
  //firestore
  const [sheets, loading, error] = useCollectionData(collection(db, "sheets"), {
    idField: "id",
  });

  const deleteSheet = async (id) => {
    const currentRef = doc(db, "sheets", id);
    await deleteDoc(currentRef);
  };

  return (
    <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
      <TableContainer component={Paper}>
        <Table aria-aria-label="customized table"></Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            sheets.map((sheet) => {
              return (
                <StyledTableRow key={sheets.name}>
                  <StyledTableCell align='right'>{sheet.name}</StyledTableCell>
                  <StyledTableCell align='right'>{sheet.location}</StyledTableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      </TableContainer>

      {/* <Grid
        container
        columns={3}
        direction={"column"}
        alignItems={"center"}
        spacing={5}
        justifyContent={"center"}
        divider
      >
        <Grid direction={"row"}>
          <h3>Name</h3>
          <h3>Location</h3>
        </Grid>
        {!loading &&
          sheets.map((sheet) => {
            return (
              <div>
                <Grid item xs={12} direction={"row"}> 
                  <h4>
                    {sheet.name} {sheet.location}
                    <DeleteIcon
                      onClick={() => {
                        deleteSheet(sheet.id);
                      }}
                    />
                  </h4>
                </Grid>
              </div>
            );
          })}
      </Grid> */}
    </Typography>
  );
}

export default Crud;
