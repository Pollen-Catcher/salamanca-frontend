import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Firestore from "./Firestore";
import db from "../../config/firebase";

//adicionar novo polen
export const addPolen = async (name) => {
  await addDoc(collection(db, "pollens"), {
    nome: name,
    intervalo: {
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
    },
  });
};

export const updateNumber =  async (value) => {
  const currentRef = doc(db, "pollens", "vMGL3X0ZSwfqp9w447Rp");
    await updateDoc(currentRef, {
      [`intervalo._00h`]: value,
    });
}

const Index = () => {
  const [name, setName] = useState("");

  const pollenCollectionRef = collection(db, "pollens");
  const [pollens, loading, error] = useCollectionData(pollenCollectionRef, {
    idField: "id",
  }); // data

  //evento de edição da tabela
  const handleCellEditCommit = async (params) => {
    console.log(params.field);

    const currentRef = doc(db, "pollens", params.id);
    await updateDoc(currentRef, {
      [`intervalo.${params.field}`]: params.value,
    });
  };

  return (
    <Firestore
      setName={setName}
      pollens={pollens}
      addPollen={() => addPolen(name)}
      handleEdit={handleCellEditCommit}
    />
  );
};

export default Index;
