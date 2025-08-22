import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "Your firebase api key",
  authDomain: "...",
  projectId: "project id",
  storageBucket: "...",
  messagingSenderId: "msg sender id",
  appId: " your app id",
  measurementId: "measurement id",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 

