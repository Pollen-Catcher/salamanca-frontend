import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import db from "../config/firebase";

export default async function usePollenList() {
  const [pollenList, setPollenList] = useState([]);

  useEffect(() => {
    const pollenListRef = collection(db, "pollens");
    getDocs(pollenListRef).then((querySnapshot) => {
      const pollens = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setPollenList(pollens);
    });
  }, []);

  return {pollenList};
}
