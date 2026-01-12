import {
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js";

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Logged in as:", result.user.name);
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

async function logout() {
  try {
    await signOut(auth);
    console.log("Logged out!");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

async function fetchSecretData() {
  const user = auth.currentUser;

  if (user) {
    console.log("Getting token for user:", user.email);
    const token = await user.getIdToken(true);
    console.log("token got: ", token);
  } else {
    console.log("You are not logged in!");
  }
}

window.login = login;
window.logout = logout;
window.fetchSecretData = fetchSecretData;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
import {
  getAuth,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.compat.js";

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
