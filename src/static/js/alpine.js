import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.store("auth", {
  user: false,
  setUser(userData) {
    this.user = userData;
  },
});

Alpine.start();
