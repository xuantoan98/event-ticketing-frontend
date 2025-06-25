<template>
  <div class="flex justify-between items-center w-full">
    <!-- <nav class="text-gray-500 text-sm hidden">
      <span v-for="(item, index) in breadcrumbItems" :key="index">
        <span>{{ item }}</span>
        <span v-if="index < breadcrumbItems.length - 1"> / </span>
      </span>
    </nav> -->

    <div class="system-logo w-[150px] flex items-center justify-center">
      <img src="../../assets/logo-cs.png" alt="Logo" class="w-full h-full object-cover">
    </div>

    <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
  </div>
</template>

<script setup>
  const props = defineProps({
    breadcrumbItems: Array,
    pageTitle: String
  });
  
</script>
