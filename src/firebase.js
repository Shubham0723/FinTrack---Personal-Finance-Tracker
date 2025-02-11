// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIFIrwqiSUhXrPqP2QsdEIrOl35hFNyas",
  authDomain: "personal-finance-tracker-eac90.firebaseapp.com",
  projectId: "personal-finance-tracker-eac90",
  storageBucket: "personal-finance-tracker-eac90.firebasestorage.app",
  messagingSenderId: "611270599141",
  appId: "1:611270599141:web:9b81639675cfd38dda4f0c",
  measurementId: "G-GSL19LQH79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };