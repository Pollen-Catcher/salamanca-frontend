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
import { makeStyles } from "@mui/styles";
import Edit from "./edit";
import { Link } from 'react-router-dom';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#108AC9",
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

const useStyles = makeStyles({
  header: {
    fontWeight: "bold",
    textAlign: "center",

  },

});

function Crud() {
  //firestore
  const [sheets, loading, error] = useCollectionData(collection(db, "sheets"), {
    idField: "id",
  });

  //styles
  const classes = useStyles();

  const deleteSheet = async (id) => {
    const currentRef = doc(db, "sheets", id);
    await deleteDoc(currentRef);
  };

  return (
    <Typography container component={'span'} variant={'body2'} color="text.secondary" align="center">
      <Table stickyHeader>
        <TableHead item>
          <TableRow>
            <StyledTableCell className={classes.header}>Name</StyledTableCell>
            <StyledTableCell className={classes.header}>Location</StyledTableCell>
            <StyledTableCell className={classes.header}>First Created</StyledTableCell>
            <StyledTableCell className={classes.header}>Last Modified</StyledTableCell>
            <StyledTableCell className={classes.header}>Edit</StyledTableCell>
            <StyledTableCell className={classes.header}>Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody item>
          {!loading &&
            sheets.map((sheet) => {
              return (
                <StyledTableRow key={sheets.name}>
                  <TableCell align='center'>{sheet.name}</TableCell>
                  <TableCell align='center'>{sheet.location}</TableCell>
                  <TableCell align='center'>{new Date(sheet.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                    year: 'numeric', 
                    month: 'numeric', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    second: 'numeric'
                    })}
                    </TableCell>
                  <TableCell align='center'>{new Date(sheet.lastEditedAt.seconds * 1000).toLocaleDateString("en-US", {
                    year: 'numeric', 
                    month: 'numeric', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    second: 'numeric'
                    })}
                    </TableCell>

                  <TableCell align='center'><DeleteIcon 
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
    </Typography>
  );
}

export default Crud;
