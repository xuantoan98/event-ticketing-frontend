<template>
  <div>
    <div class="flex items-center justify-between">
      <h2>Sự kiện của tôi</h2>

      <div class="flex items-center gap-x-4">
        <div class="flex flex-wrap gap-4">
          <!-- Sắp xếp -->
           <el-select v-model="sortOption" placeholder="Sắp xếp" style="width: 160px">
            <el-option
              v-for="item in eventOptionsSort"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- Lọc trạng thái -->
           <el-select v-model="statusFilter" placeholder="Trạng thái" style="width: 160px">
            <el-option
              v-for="item in eventFilterStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <EventCards
        v-for="(event, index) in filteredAndSortedEvents"
        :key="index"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useEventStore } from '../../stores/event';
  import EventCards from '../events/EventCards.vue';

  const eventStore = useEventStore();

  const sortOption = ref('');
  const statusFilter = ref('');
  const eventOptionsSort = ref([
    { label: 'Sắp xếp', value: '' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Tên A-Z', value: 'name' }
  ]);

  const eventFilterStatus = ref([
    { label: 'Tất cả', value: '' },
    { label: 'Khởi tạo', value: 'create' },
    { label: 'Đang diễn ra', value: 'process' },
    { label: 'Đã hoàn thành', value: 'closed' },
    { label: 'Đã hủy', value: 'cancelled' }
  ]);

  const filteredAndSortedEvents  = computed(() => {
    let result = [...eventStore.events];

    // lọc theo trạng thái
    if (statusFilter.value) {
      result = result.filter(e => e.status === statusFilter.value);
    }

    if (sortOption.value) {
      if (sortOption.value === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else if (sortOption.value === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      } else if (sortOption.value === 'name') {
        result.sort((a, b) => a.title.localeCompare(b.title))
      }
    }

    return result;
  });
  
  onMounted(() => {
    eventStore.fetchMyEvents();
  });
</script>