import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail} from "firebase/auth";
import Login from "./LoginPage";
import db from "../../config/firebase";
import {auth, signInWithGoogle} from "../../config/firebase";
import { useParams } from "react-router-dom";

export default() => {
  
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

  })

  const register = async () => {

    try {
      const user = await createUserWithEmailAndPassword(
        auth, 
        registerEmail, 
        registerPassword
        );
      console.log(user)

    }catch(error) {
      console.log(error.message);
    }
  };

  const login = async () => {

    try {
      const user = await signInWithEmailAndPassword(
        auth, 
        loginEmail, 
        loginPassword
        );
      console.log(user)

    }catch(error) {
      console.log(error.message);
    }  
  };

  const logout = async () => {

    await signOut(auth);
  };

  const forgotPassword = async () => {

    await sendPasswordResetEmail(auth, loginEmail)
    .then(() => { console.log("Password Sent" + loginEmail);
    })
    .catch(error => {console.error(error);
    })
    
  };
    
  return(
    <Login
      setRegisterEmail = {setRegisterEmail}
      setRegisterPassword = {setRegisterPassword}
      setLoginEmail = {setLoginEmail}
      setLoginPassword = {setLoginPassword}
      register = {register}
      logout = {logout}
      login = {login}
      forgotPassword = {forgotPassword}
      user = {user}
     />
  );
};