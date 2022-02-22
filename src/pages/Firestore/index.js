import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Sheet from "./Sheet";
import db from "../../config/firebase";
import { useParams } from "react-router-dom";

const Index = () => {
  const { sheetId } = useParams();
  const [name, setName] = useState("");

  const pollenCollectionRef = collection(db, "sheets", sheetId, "pollens");
  const [pollens, loading, error] = useCollectionData(pollenCollectionRef, {
    idField: "id",
  }); // data

  //adicionar novo polen
  const addPolen = async () => {
    await addDoc(pollenCollectionRef, {
      name: name,
      intervals: {
        _00h: 0,
        _01h: 0,
        _02h: 0,
        _03h: 0,
        _04h: 0,
        _05h: 0,
        _06h: 0,
        _07h: 0,
        _08h: 0,
        _09h: 0,
        _10h: 0,
        _11h: 0,
        _12h: 0,
        _13h: 0,
        _14h: 0,
        _15h: 0,
        _16h: 0,
        _17h: 0,
        _18h: 0,
        _19h: 0,
        _20h: 0,
        _21h: 0,
        _22h: 0,
        _23h: 0,
      },
    });
  };

  //evento de edição da tabela
  const handleCellEditCommit = async (params) => {
    const currentRef = doc(db, "sheets", sheetId, "pollens", params.id);
    await updateDoc(currentRef, {
      [`intervalo.${params.field}`]: params.value,
    });
  };

  return (
    <Sheet
      setName={setName}
      pollens={pollens}
      loading={loading}
      addPollen={addPolen}
      handleEdit={handleCellEditCommit}
    />
  );
};

export default Index;
