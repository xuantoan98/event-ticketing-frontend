import Dashboard from "../views/Dashboard.vue";
import Departments from "../views/Departments.vue";
import EventCategory from "../views/EventCategory.vue";
import Events from "../views/Events.vue";
import Users from "../views/Users.vue";

export const routeDefinitions = [
  {
    path: '/dashboard',
    label: 'Báo cáo thông kê',
    component: Dashboard
  },
  {
    path: '/event-category',
    label: 'Danh mục sự kiện',
    component: EventCategory
  },
  {
    path: '/events',
    label: 'Sự kiện',
    component: Events
  },
  {
    path: '/user',
    label: 'Người dùng',
    component: Users
  },
  {
    path: '/departments',
    label: 'Phòng ban',
    component: Departments
  }
];
