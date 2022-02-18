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
import EditIcon from '@mui/icons-material/Edit';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#707070",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    width: '100%',
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

  const editSheet = async (params) => {
    const currentRef = doc(db, "pollens", params.id);
    await updateDoc(currentRef, {
      [`intervalo.${params.field}`]: params.value,
    });
  };
  
  return (
    <Typography container color="text.secondary" align="center">
      <Table>
        <TableHead item>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">First Created</StyledTableCell>
            <StyledTableCell align="center">Last Modified</StyledTableCell>
            <StyledTableCell align="center">Edit</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody item>
          {!loading &&
            sheets.map((sheet) => {
              return (
                <StyledTableRow key={sheets.name}>
                  <TableCell align='center'>{sheet.name}</TableCell>
                  <TableCell align='center'>{sheet.location}</TableCell>
                  <TableCell align='center'>{new Date(sheet.createdAt.seconds * 1000).toLocaleDateString("en-US")}</TableCell>
                  <TableCell align='center'>{new Date(sheet.lastEditedAt.seconds * 1000).toLocaleDateString("en-US")}</TableCell>
                  <TableCell align='center'><EditIcon 
                      onClick={() => {
                        editSheet(sheet.id);
                      }}
                    /></TableCell>
                  <TableCell align='center'><DeleteIcon 
                      onClick={() => {
                        deleteSheet(sheet.id);
                      }}
                    /></TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>

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
