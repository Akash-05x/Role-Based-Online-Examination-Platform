import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "AIzaSyC9ZNd1HrZYTfzYKTl3hykICKPs2_8bPPk",
  authDomain: "mini-39bc3.firebaseapp.com",
  projectId: "mini-39bc3",
  storageBucket: "mini-39bc3.appspot.com",
  messagingSenderId: "69321091430",
  appId: "1:69321091430:web:b99af8ff509c075c3e80a7",
  measurementId: "G-CB01HJB188",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
