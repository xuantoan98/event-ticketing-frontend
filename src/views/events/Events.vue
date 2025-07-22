<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách sự kiện</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div>
    <el-table :data="eventStore.events" v-loading="eventStore.loading">
      <el-table-column prop="coverImage" label="Ảnh sự kiện" width="110">
        <template #default="{ row }">
          <div class="flex items-center justify-center p-1 border border-dashed rounded-full w-[60px] h-[60px]">
            <img class="rounded-full w-full h-full object-cover block" :src="row.coverImage || 'src/assets/banner-default.webp'" loading="lazy" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Tiêu đề" />
      <el-table-column prop="startDate" label="Thời gian diễn ra">
        <template #default="{ row }">
          <div class="flex items-center gap-x-1">
            <el-icon><Clock /></el-icon>
            {{ formatDateTime(row.startDate) }}
          </div>
          <div class="flex items-center gap-x-1">
            <el-icon><AlarmClock /></el-icon>
            {{ formatDateTime(row.endDate) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="getStatusInfo(row.status).type">
            {{ getStatusInfo(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventCategoriesId" label="Danh mục">
        <template #default="{ row }">
          <template v-for="(item, index) in row.eventCategoriesId.slice(0,1)" :key="index">
            <el-tag size="small" class="mr-1">{{ item.name }}</el-tag>
          </template>
          <el-tooltip v-if="row.eventCategoriesId.length > 1" placement="top">
            <template #content>
              {{ row.eventCategoriesId.slice(1).map(c => c.name).join(', ') }}
            </template>
            <el-tag size="small" type="info">+{{ row.eventCategoriesId.length - 1 }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="Địa chỉ" show-overflow-tooltip />
      <!-- <el-table-column prop="description" label="Mô tả" show-overflow-tooltip /> -->

      <el-table-column label="Hành động">
        <!-- <template #default="{ row }">
          <el-button type="warning" size="small" @click="openEditModal(row)">Sửa</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="deleteInvite(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template> -->
      </el-table-column>
      <template #empty>
        <div class="text-gray-500 text-sm italic text-center py-6">
          Dữ liệu sự kiện trống.
        </div>
      </template>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="eventStore.total"
        layout="prev, pager, next"
      />
    </div>
  </div>

  <EventFormModal
    v-model:visible="showModal"
    :eventData="editingEvent"
    @refresh="fetchEvents"
  />
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import { useEventStore } from '../../stores/event';
  import { DEFAULT_PAGE, PAGE_SIZE } from '../../constants';
  import { AlarmClock, Clock, Search } from '@element-plus/icons-vue';
  import { formatDateTime } from '../../utils/formatter';
  import EventFormModal from '../../components/events/EventFormModal.vue';

  const eventStore = useEventStore();
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(PAGE_SIZE);
  const showModal = ref(false);
  const editingEvent = ref(null);

  function getStatusInfo(status) {
    const statusMap = {
      create: { label: 'Khởi tạo', type: 'info' },
      process: { label: 'Đang diễn ra', type: 'primary' },
      closed: { label: 'Đã hoàn thành', type: 'success' },
      cancelled: { label: 'Đã hủy', type: 'danger' }
    };

    return statusMap[status] || { label: 'Không xác định', type: 'default' };
  }

  function openAddModal() {
    showModal.value = true;
    editingEvent.value = null;
  }

  const fetchEvents = async () => {
    await eventStore.fetchEvents();
  }

  watch(currentPage, (page) => {
    eventStore.fetchEvents(page, PAGE_SIZE);
  });

  onMounted(() => {
    eventStore.fetchEvents(currentPage.value, PAGE_SIZE);
  });
</script>
