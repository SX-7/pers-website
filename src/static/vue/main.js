import { createApp } from "vue";
import ProjectCard from "./components/ProjectCard.vue";

const app = createApp();

// Register the component we are about to make
app.component("project-card", ProjectCard);

app.mount("#app");
