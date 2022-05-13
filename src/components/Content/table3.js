import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  import db from "../../config/firebase";
  import DeleteIcon from "@mui/icons-material/Delete";

function Table3(){
    const [sheets, setSheet] = useState([]);
    const sheetsCollectionRef = collection(db, "sheets");

    useEffect(() => {
        const getSheet = async () => {
          const data = await getDocs(sheetsCollectionRef);
          setSheet(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
    
        getSheet();
      }, []);

    return (
        <TableContainer component={Paper}>
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
        </TableContainer>
    );
}

export default Table3;
