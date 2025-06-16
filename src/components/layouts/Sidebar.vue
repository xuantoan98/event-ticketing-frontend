<template>
  <ul class="space-y-2">
    <li
      v-for="(item, index) in navLinks"
      :key="index"
      class="m-0"
    >
      <router-link
        :to="item.path" 
        class="block px-4 py-2 rounded-sm hover:bg-gray-200" 
        active-class="bg-gray-300 font-semibold"
      >
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
  const navLinks = [
    { path: '/dashboard', label: 'Báo cáo thống kê' },
    { path: '/event-category', label: 'Quản lý danh mục sự kiện' },
    { path: '/events', label: 'Quản lý sự kiện' },
    { path: '/users', label: 'Quản lý người dùng' },
    { path: '/departments', label: 'Quản lý phòng ban' }
  ];
</script>
