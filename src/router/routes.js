export const routeDefinitions = [
  {
    path: 'dashboard',
    label: 'Báo cáo thông kê',
    component: () => import('../views/Dashboard.vue') // Sử dụng import động để lazy load
  },
  {
    path: 'event-category',
    label: 'Danh mục sự kiện',
    component: () => import('../views/EventCategory.vue')
  },
  {
    path: 'events',
    label: 'Sự kiện',
    component: () => import('../views/Events.vue')
  },
  {
    path: 'user',
    label: 'Người dùng',
    component: () => import('../views/Users.vue')
  },
  {
    path: 'departments',
    label: 'Phòng ban',
    component: () => import('../views/Departments.vue')
  },
  {
    path: 'user/:id',
    name: 'user-detail',
    label: 'Thông tin tài khoản',
    component: () => import('../views/UserDetail.vue')
  }
];
