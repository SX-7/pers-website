import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbjMp-xYE3FniPH7Fohohc20r9o2aAqy8",
  authDomain: "pers-website-397711.firebaseapp.com",
  projectId: "pers-website-397711",
  storageBucket: "pers-website-397711.firebasestorage.app",
  messagingSenderId: "51906297285",
  appId: "1:51906297285:web:853753ac87c0b8585a5fac",
  measurementId: "G-YH714G7CDT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

export { auth, provider };
