// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);
export const auth = getAuth(app);

// Gmail provider
const provider = new GoogleAuthProvider();

 export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      console.log(error);
    });
};

//connectFirestoreEmulator(db, "localhost", 8080);

export default db;
