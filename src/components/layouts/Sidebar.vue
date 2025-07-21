<template>
  <ul class="space-y-2">
    <li
      v-for="(item, index) in navLinks"
      :key="index"
      class="m-0"
    >
      <router-link
        :to="item.path" 
        class="block px-4 py-2 rounded-sm hover:bg-white flex items-center gap-3"
        active-class="bg-white font-semibold"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
  import { routeDefinitions } from '../../router/routes';
  const navLinks = routeDefinitions.map(({ path, label, icon }) => ({ path: `/${path}`, label, icon }));
</script>
