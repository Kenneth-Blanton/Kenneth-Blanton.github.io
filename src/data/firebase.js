import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5f77mtXQef_knr-SpTeoVrVzIroVb73w",
  authDomain: "optinote-11172.firebaseapp.com",
  projectId: "optinote-11172",
  storageBucket: "optinote-11172.appspot.com",
  messagingSenderId: "965543099974",
  appId: "1:965543099974:web:c7882d2b56b3e696b65447",
  measurementId: "G-CVM44KMRVB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
