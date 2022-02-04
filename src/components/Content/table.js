import * as React from "react";
import { Typography, Grid, Stack } from "@mui/material";
import { collection, doc, deleteDoc } from "firebase/firestore";
import db from "../../config/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Table() {
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
      {!loading &&
        sheets.map((sheet) => {
          return (
            <div>
              <Grid
                container
                direction={"row"}
                alignItems={"center"}
                spacing={3}
                justifyContent={"center"}
              >
                <Grid item xs={12}>
                  <h4>
                    Name: {sheet.name} Location: {sheet.location}
                    <DeleteIcon
                      onClick={() => {
                        deleteSheet(sheet.id);
                      }}
                    />
                  </h4>
                </Grid>
              </Grid>
            </div>
          );
        })}
    </Typography>
  );
}

export default Table;
