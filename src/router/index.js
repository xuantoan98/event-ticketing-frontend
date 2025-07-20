import { createRouter, createWebHistory } from "vue-router";
import { routeDefinitions } from "./routes";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue'), // Layout riêng, không MainLayout
    meta: { public: true }
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('../components/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'user/:id',
        name: 'user-detail',
        label: 'Thông tin tài khoản',
        component: () => import('../views/users/UserDetail.vue')
      },
      ...routeDefinitions
    ]
  },
  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isPublic = to.meta?.public;
  const isLoggedIn = auth.isAuthenticated;

  if (!isPublic && !isLoggedIn && to.path !== '/login') {
    return next('/login');
  }

  if (isLoggedIn && to.path === '/login') {
    return next('/dashboard'); // Nếu login rồi mà vào lại login thì redirect
  }

  next();
});

export default router;
