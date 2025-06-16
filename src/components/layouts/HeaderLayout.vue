<template>
  <div class="flex justify-between items-center w-full">
    <nav class="text-gray-500 text-sm">
      <span v-for="(item, index) in breadcrumbItems" :key="index">
        <span>{{ item }}</span>
        <span v-if="index < breadcrumbItems.length - 1"> / </span>
      </span>
    </nav>
    <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
  </div>
</template>

<script setup>
  const props = defineProps({
    breadcrumbItems: Array,
    pageTitle: String
  });
</script>

<style scoped>

</style>
