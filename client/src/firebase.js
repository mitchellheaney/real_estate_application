// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-app-mern.firebaseapp.com",
  projectId: "real-estate-app-mern",
  storageBucket: "real-estate-app-mern.appspot.com",
  messagingSenderId: "20721645180",
  appId: "1:20721645180:web:e6f3ea1062e97dd29cfbf9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
