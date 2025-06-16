import { createRouter, createWebHistory } from "vue-router";
import { routeDefinitions } from "./routes";

const routes = [
  ...routeDefinitions.map(({ path, component }) => ({ path, component })),
  { path: '/', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
