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
  import { routeDefinitions } from '../../router/routes';
  const navLinks = routeDefinitions.map(({ path, label }) => ({ path: `/${path}`, label }));
</script>
