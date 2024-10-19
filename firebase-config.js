import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMZAiDEFriFx3zYEPORFdXMoMvQCH7nC0",
  authDomain: "donnell-gradedlab5.firebaseapp.com",
  projectId: "donnell-gradedlab5",
  storageBucket: "donnell-gradedlab5.appspot.com",
  messagingSenderId: "1050619674768",
  appId: "1:1050619674768:web:fe6df835440af4f0315815",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)