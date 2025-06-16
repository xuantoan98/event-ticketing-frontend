import { createRouter, createWebHistory } from "vue-router";

import DashboardView from '../views/Dashboard.vue';
import UserView from '../views/Users.vue';

const routes = [
  { path: '/dashboard', component: DashboardView },
  { path: '/users', component: UserView },
  { path: '/', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
