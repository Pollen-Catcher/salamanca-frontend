import { useState, useEffect } from "react";
import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Search, Refresh } from "@mui/icons-material";
import { CreateSheetBox } from "./styles";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import db from "../../config/firebase";
import DeleteIcon from "@mui/icons-material/Delete";

function Table() {
    const [sheets, setSheet] = useState([]);
    const sheetsCollectionRef = collection(db, "sheets");
  
    const deleteSheet = async (id) => {
      const currentRef = doc(db, "sheets", id);
      await deleteDoc(currentRef);
    };
  
    useEffect(() => {
      const getSheet = async () => {
        const data = await getDocs(sheetsCollectionRef);
        setSheet(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };
  
      getSheet();
    }, []);
    return (
        <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          {sheets.map((sheet) => {
            return (
              <div>
                {" "}
                <h4> Name: {sheet.name} Location: {sheet.location}
                  <DeleteIcon
                    onClick={() => {
                      deleteSheet(sheet.id);
                    }}
                  /></h4>
              </div>
            );
          })}
        </Typography>
    );
  }

export default Table;
