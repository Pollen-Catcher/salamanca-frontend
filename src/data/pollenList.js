import { collection, getDocs } from "firebase/firestore";
import db from "../config/firebase";

export default async function pollenList() {
  let pollenList = [];

  const dbPollens = await getDocs(collection(db, "pollens"));

  dbPollens.forEach((doc) => {
    pollenList.push(doc.data().nome)
  });

  return (pollenList);
}