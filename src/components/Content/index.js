import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "../../config/firebase";
import Content from "./Content";
import { Sheet, sheetConverter } from "../../models/Sheet";

const defaultValues = {
  name: "",
  location: "",
};

const db = getFirestore(app);

export default ({}) => {
  //modal dialog
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const handleOpenCreateSheet = () => setOpenCreateSheet(true);
  const handleCloseCreateSheet = () => setOpenCreateSheet(false);

  //form
  const { handleSubmit, reset, setValue, control } = useForm({ defaultValues });
  //const [data, setData] = useState(null);

  const addSheet = async (data) => {
    //setData(data);
    const { name, location } = data;

    const sheet = new Sheet(name, location);
    await addDoc(collection(db, "sheets").withConverter(sheetConverter), sheet);
  };

  return (
    <Content
      openCreateSheet={openCreateSheet}
      handleOpenCreateSheet={handleOpenCreateSheet}
      handleCloseCreateSheet={handleCloseCreateSheet}
      handleSubmit={handleSubmit}
      control={control}
      addSheet={addSheet}
    />
  );
};
