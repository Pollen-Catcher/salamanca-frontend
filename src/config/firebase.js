// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo8k21migi4BkoYC0Ic8w3jD5n4sx4nDY",
  authDomain: "salamanca-project.firebaseapp.com",
  projectId: "salamanca-project",
  storageBucket: "salamanca-project.appspot.com",
  messagingSenderId: "877270673339",
  appId: "1:877270673339:web:d356a9d640ae74eebe869e",
  measurementId: "G-G4W9MT9ECW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

connectFirestoreEmulator(db, "localhost", 8080);
connectAuthEmulator(auth, "http://localhost:9099");

export { app };
