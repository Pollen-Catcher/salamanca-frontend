import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./LoginPage";
import db from "../../config/firebase";
import { useParams } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
}

export default() => {


  return(
    <Login />
  );
};