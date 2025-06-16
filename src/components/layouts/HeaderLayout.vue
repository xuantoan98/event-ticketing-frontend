<template>
  <header class="header flex align-center justify-between w-full">
    <div separator="/">
      <a v-for="(item, index) in breadcrumbItems" :key="index">
        {{ item }}
      </a>
    </div>

    <h2 class="page-title">{{ pageTitle }}</h2>
  </header>
</template>

<script setup>
  const props = defineProps({
    breadcrumbItems: Array,
    pageTitle: String
  });
</script>

<style scoped>

</style>
