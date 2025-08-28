import { PieChart, Calendar, Stamp, User, Menu } from '@element-plus/icons-vue';

export const routeDefinitions = [
  {
    path: 'dashboard',
    label: 'Báo cáo thống kê',
    icon: PieChart,
    component: () => import('../views/Dashboard.vue') // Sử dụng import động để lazy load
  },
  {
    path: 'event-category',
    label: 'Danh mục sự kiện',
    icon: Stamp,
    component: () => import('../views/event-categories/EventCategories.vue')
  },
  {
    path: 'events',
    label: 'Sự kiện',
    icon: Calendar,
    component: () => import('../views/events/Events.vue')
  },
  {
    path: 'user',
    label: 'Người dùng',
    icon: User,
    component: () => import('../views/users/Users.vue')
  },
  {
    path: 'departments',
    label: 'Phòng ban',
    icon: Menu,
    component: () => import('../views/Departments.vue')
  },
  {
    path: 'invites',
    label: 'Khách mời',
    icon: User,
    component: () => import('../views/invites/Invites.vue')
  }
];
