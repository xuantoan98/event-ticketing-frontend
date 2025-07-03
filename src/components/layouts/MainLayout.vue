<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="p-4 bg-gray-100">
      <div class="h-16 bg-white shadow px-4 flex items-center rounded-sm">
        <HeaderLayout :breadcrumb-items="['Dashboard']" :page-title="pageTitle" />
      </div>
    </header>

    <!-- Body: Sidebar + Main -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-100 px-4 overflow-y-auto">
        <div class="h-full">
          <Sidebar />
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-100 overflow-y-auto pr-4">
        <div class="w-full h-full bg-white p-4 rounded-sm shadow">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import HeaderLayout from './HeaderLayout.vue';
  import Sidebar from './Sidebar.vue';

  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  
  const route = useRoute();
  const pageTitle = computed(() => {
    const map = {
      '/dashboard': 'Trang thống kê',
      '/users': 'Quản lý người dùng'
    }

    return map[route.path] || 'Trang chính';
  });
  
</script>
