const firebaseConfig = {
  apiKey: "AIzaSyAbjMp-xYE3FniPH7Fohohc20r9o2aAqy8",
  authDomain: "pers-website-397711.firebaseapp.com",
  projectId: "pers-website-397711",
  storageBucket: "pers-website-397711.firebasestorage.app",
  messagingSenderId: "51906297285",
  appId: "1:51906297285:web:853753ac87c0b8585a5fac",
  measurementId: "G-YH714G7CDT",
};

// Global state to hold the instance
let firebaseAuth = null;
let firebaseProvider = null;

/**
 * Lazy-loads Firebase only when needed.
 */
async function getLazyFirebase() {
  if (firebaseAuth) {
    return { auth: firebaseAuth, provider: firebaseProvider };
  }

  // Dynamic imports.
  // Vite will automatically split this into a separate chunk.
  const [{ initializeApp }, { getAuth, GithubAuthProvider }] =
    await Promise.all([import("firebase/app"), import("firebase/auth")]);

  const app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
  firebaseProvider = new GithubAuthProvider();

  return { auth: firebaseAuth, provider: firebaseProvider };
}

async function login() {
  try {
    // Initialize lazily
    const { auth, provider } = await getLazyFirebase();

    // We need to import signInWithPopup dynamically too,
    // or destructure it from the module above if you prefer.
    const { signInWithPopup } = await import("firebase/auth");

    const result = await signInWithPopup(auth, provider);
    // Note: Firebase user uses 'displayName', not 'name'
    console.log("Logged in as:", result.user.displayName);
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

async function logout() {
  try {
    // If auth is null, we haven't even loaded the SDK yet, so we are definitely logged out.
    if (!firebaseAuth) {
      console.log("Logged out!");
      return;
    }

    const { signOut } = await import("firebase/auth");
    await signOut(firebaseAuth);
    console.log("Logged out!");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

async function fetchSecretData() {
  // Even for data fetching, we ensure Auth is ready first.
  // This will restore the session from IndexedDB if the user refreshed the page.
  const { auth } = await getLazyFirebase();
  const user = auth.currentUser;

  if (user) {
    console.log("Getting token for user:", user.email);
    const token = await user.getIdToken(true);
    console.log("token got: ", token);
  } else {
    console.log("You are not logged in!");
  }
}

// Attach to window
window.login = login;
window.logout = logout;
window.fetchSecretData = fetchSecretData;

export { firebaseAuth };
