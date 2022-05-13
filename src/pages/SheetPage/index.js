import { useState } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SheetPage from "./SheetPage";
import { app } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { Pollen, pollenConverter } from "../../models/Pollen";

const db = getFirestore(app);

export default () => {
  const { sheetId } = useParams();

  const [name, setName] = useState("");

  const pollenCollectionRef = collection(
    db,
    "sheets",
    sheetId,
    "pollens"
  ).withConverter(pollenConverter);
  const [pollens, loading, error] = useCollectionData(pollenCollectionRef);

  const addPollen = async () => {
    const pollen = new Pollen(name);
    await addDoc(pollenCollectionRef, pollen);
  };

  const handleCellEditCommit = async (params) => {
    const currentRef = doc(db, "sheets", sheetId, "pollens", params.id);
    await updateDoc(currentRef, {
      [`intervals.${params.field}`]: params.value,
    });
  };

  return (
    <SheetPage
      setName={setName}
      pollens={pollens}
      sheetId={sheetId}
      loading={loading}
      addPollen={addPollen}
      handleEdit={handleCellEditCommit}
    />
  );
};
