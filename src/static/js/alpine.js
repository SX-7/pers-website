import Alpine from "alpinejs";
import { firebaseAuth } from "./app.js";

window.Alpine = Alpine;

Alpine.store("auth", {
  user: false,

  init() {
    // Firebase Auth Listener
    firebaseAuth.onAuthStateChanged((user) => {
      this.user = user;
    });
  },
});

Alpine.start();
