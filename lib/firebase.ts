import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDGi-CgWtARM_05E_dOpolxpeiA_7ZcGE",
  authDomain: "crimson-beatstream.firebaseapp.com",
  projectId: "crimson-beatstream",
  storageBucket: "crimson-beatstream.firebasestorage.app",
  messagingSenderId: "494120299831",
  appId: "1:494120299831:web:32e42b37c97d1ee180beb2",
};

const app = initializeApp(firebaseConfig);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);

export const auth = getAuth(app);

export const provider =
  new GoogleAuthProvider();