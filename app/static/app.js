import { auth } from "./firebase-config.js";

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

window.fetchSecretData = fetchSecretData;
