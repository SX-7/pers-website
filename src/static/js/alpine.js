import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.store("auth", {
  user: false,
});

Alpine.start();
