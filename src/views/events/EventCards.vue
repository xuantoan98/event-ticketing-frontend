<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <img
      :src="event.coverImage || 'src/assets/banner-default.webp'"
      :alt="event.coverImage.alt"
      class="w-full h-48 object-cover"
    />

    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ event.title }}</h3>
      <el-tag class="inline-block text-sm font-medium mb-3" :type="getStatusInfo(event.status).type">
        {{ getStatusInfo(event.status).label }}
      </el-tag>
      <div class="text-sm text-gray-600 space-y-1">
        <p>Bắt đầu: {{ new Date(event.startDate).toLocaleString() }}</p>
        <p>Kết thúc: {{ new Date(event.endDate).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

  const props = defineProps({
    event: {
      type: Object,
      required: true
    }
  });

  function getStatusInfo(status) {
    const statusMap = {
      create: { label: 'Khởi tạo', type: 'info' },
      process: { label: 'Đang diễn ra', type: 'primary' },
      closed: { label: 'Đã hoàn thành', type: 'success' },
      cancelled: { label: 'Đã hủy', type: 'danger' }
    };

    return statusMap[status] || { label: 'Không xác định', type: 'default' };
  }

  const statusClass = computed(() => {
    switch (props.event.status) {
      case 'create':
        return 'bg-green-100 text-green-800'
      case 'process':
        return 'bg-gray-200 text-gray-700'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  });
</script>