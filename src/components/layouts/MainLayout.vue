<template>
  <div v-if="auth.user" class="h-screen flex flex-col">
    <!-- Header -->
    <header class="p-4 bg-gray-100">
      <div class="h-16 bg-white shadow px-4 flex items-center rounded-sm">
        <HeaderLayout />
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
      <main class="flex-1 bg-gray-100 pr-4">
        <div class="w-full h-full bg-white p-4 rounded-sm shadow overflow-y-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import HeaderLayout from './HeaderLayout.vue';
  import Sidebar from './Sidebar.vue';
  import { useAuthStore } from '../../stores/auth';

  const auth = useAuthStore();
</script>
