export const routeDefinitions = [
  {
    path: '/login',
    component: import('../views/Login.vue'), // Layout riêng, không MainLayout
    meta: { public: true }
  },
  {
    path: '/',
    component: import('../components/layouts/MainLayout.vue'), // Sử dụng MainLayout cho các route chính
    meta: { public: false },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        label: 'Báo cáo thông kê',
        component: import('../views/Dashboard.vue') // Sử dụng import động để lazy load
      },
      {
        path: 'event-category',
        label: 'Danh mục sự kiện',
        component: import('../views/EventCategory.vue')
      },
      {
        path: 'events',
        label: 'Sự kiện',
        component: import('../views/Events.vue')
      },
      {
        path: 'user',
        label: 'Người dùng',
        component: import('../views/Users.vue')
      },
      {
        path: 'departments',
        label: 'Phòng ban',
        component: import('../views/Departments.vue')
      }
    ]
  },
];
