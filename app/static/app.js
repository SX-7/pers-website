import { auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
