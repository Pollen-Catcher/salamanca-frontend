import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import db from "../../config/firebase";
import Content from "./Content";

const defaultValues = {
  name: "",
  location: "",
};

const Index = ({}) => {
  //modal dialog
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const handleOpenCreateSheet = () => setOpenCreateSheet(true);
  const handleCloseCreateSheet = () => setOpenCreateSheet(false);

  //form
  const { handleSubmit, reset, setValue, control } = useForm({ defaultValues });
  const [data, setData] = useState(null);

  const addSheet = async (data) => {
    setData(data);
    const { name, location } = data;

    const docRef = await addDoc(collection(db, "sheets"), {
      name,
      location: location,
      createdAt: Timestamp.now(),
      lastEditedAt: Timestamp.now(),
    });

    /*await addDoc(collection(db, `${docRef.path}/pollens`), {
      sheetId: docRef.id,
      name,
      location,
      createdAt: Timestamp.now(),
      lastEditedAt: Timestamp.now(),
    });*/
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

Index.propTypes = {};

export default Index;
