import { createRouter, createWebHistory } from "vue-router";

import DashboardView from '../views/Dashboard.vue';
import UserView from '../views/Users.vue';
import EventView from '../views/Events.vue';
import DepartmentView from '../views/Departments.vue';
import EventCategoryView from '../views/EventCategory.vue';

const routes = [
  { path: '/dashboard', component: DashboardView },
  { path: '/users', component: UserView },
  { path: '/events', component: EventView },
  { path: '/event-category', component: EventCategoryView },
  { path: '/departments', component: DepartmentView },
  { path: '/', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
