import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2dvsnp8-Y-V83WrMa8j4BdB9iL3fHJrE",
  authDomain: "sancars-810ad.firebaseapp.com",
  projectId: "sancars-810ad",
  storageBucket: "sancars-810ad.firebasestorage.app",
  messagingSenderId: "811633641978",
  appId: "1:811633641978:web:dd6a6cfe56da21ea21fc43"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
