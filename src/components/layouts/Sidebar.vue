<template>
  <el-menu
    class="sidebar"
    default-active="$route.path"
    @select="handleSelect"
    router
  >
    <el-menu-item index="/dashboard">Báo cáo thống kê</el-menu-item>
    <el-menu-item index="/users">Quản lý người dùng</el-menu-item>
  </el-menu>
</template>

<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const handleSelect = (index) => {
    router.push(index);
  }
</script>

<style scoped>
  .sidebar {
    height: 100%;
    border-right: 1px solid #ebeef5;
  }
</style>
