<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách sự kiện</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
        @input="handleSearchEvent"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div class="mt-4 flex items-center gap-x-4">
    <el-select 
      v-model="searchTypeEvent" 
      placeholder="Loại sự kiện" 
      :key="searchTypeEvent"
      @change="handleSearchTypeEvent"
      style="max-width: 250px;"
    >
      <el-option
        v-for="item in eventCategoriesOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <el-date-picker
      v-model="filterStartEndDate"
      type="daterange"
      range-separator="-"
      start-placeholder="Bắt đầu"
      end-placeholder="Kết thúc"
      size="default"
      style="max-width: 300px;"
      @change="handleFilterDate"
    />
  </div>

  <div class="mt-4">
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
      <el-table-column prop="estimatePrice" label="Chi phí dự kiến (đ)">
        <template #default="{ row }">
          <div class="flex items-center gap-x-1">
            {{ formatCurrencyVND(row.estimatePrice) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realPrice" label="Chi phí thực tế (đ)">
        <template #default="{ row }">
          <div class="flex items-center gap-x-1">
            {{ formatCurrencyVND(row.realPrice) }}
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
          <template v-for="(item, index) in row.eventCategory?.slice(0,1)" :key="index">
            <el-tag size="small" class="mr-1">{{ item.name }}</el-tag>
          </template>
          <el-tooltip v-if="row.eventCategory && row.eventCategory.length > 1" placement="top">
            <template #content>
              {{ row.eventCategory?.slice(1).map(c => c.name).join(', ') }}
            </template>
            <el-tag size="small" type="info">+{{ row.eventCategory.length - 1 }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="location" label="Địa chỉ" show-overflow-tooltip /> -->

      <el-table-column prop="" label="Người phụ trách">
        <template #default="{ row }">
          {{ row.userCreated?.name || 'Chưa có' }}
        </template>
      </el-table-column>

      <el-table-column label="Hành động">
        <template #default="{ row }">
          <el-button v-if="auth.user.id === row.createdBy" type="warning" size="small" @click="openEditModal(row, true)">Sửa</el-button>
          <el-button v-else type="primary" size="small" @click="openEditModal(row, false)">Xem</el-button>

          <el-button 
            v-if="auth.user.id === row.createdBy"
            type="danger" 
            size="small" 
            @click="deleteEvent(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template>
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
    :allow-update="allowUpdate"
    @refresh="fetchEvents"
  />
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useEventStore } from '../../stores/event';
  import { DEFAULT_PAGE, PAGE_SIZE } from '../../constants';
  import { AlarmClock, Clock, Search } from '@element-plus/icons-vue';
  import { formatDateTime, formatCurrencyVND } from '../../utils/formatter';
  import EventFormModal from '../../components/events/EventFormModal.vue';
  import { debounce } from 'lodash';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useAuthStore } from '../../stores/auth';
  import { useEventCategoriesStore } from '../../stores/eventCategories';

  const eventStore = useEventStore();
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(PAGE_SIZE);
  const showModal = ref(false);
  const editingEvent = ref(null);
  const searchQuery = ref('');
  const searchTypeEvent = ref('');
  const filterStartEndDate = ref('');
  const deletingId = ref(null);
  const eventCategoriesOptions = ref([]);
  const allowUpdate = ref(false);

  const auth = useAuthStore();
  const eventCategoriesStore = useEventCategoriesStore();

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

  function openEditModal(eventData, isAllowUpdate = false) {
    showModal.value = true;
    editingEvent.value = eventData;
    allowUpdate.value = isAllowUpdate;
  }

  async function deleteEvent(eventId) {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn dừng hoạt động sự kiện này?',
        'Xác nhận',
        {
          confirmButtonText: 'Dừng',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      );

      deletingId.value = eventId;
      const result = await eventStore.deleteEvent(eventId);
      deletingId.value = null;

      if (result.status === 200) {
        ElMessage.success('Thay đổi trạng thái sự kiện thành công.');
        fetchEvents();
      } else {
        ElMessage.error('Thay đổi trạng thái sự kiện thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {}
  }

  const fetchEvents = async () => {
    await eventStore.fetchEvents();
  }

  async function handleSearchResult () {
    if (searchQuery.value.trim()) {
      await eventStore.fetchEvents({
        q: searchQuery.value.trim(),
        eventCategory: searchTypeEvent.value
      });
    } else {
      fetchEvents();
    }
  }

  const handleSearchEvent = debounce(handleSearchResult, 500);

  const handleSearchTypeEvent = async () => {
    if (searchTypeEvent.value) {
      await eventStore.fetchEvents({
        q: searchQuery.value.trim(),
        eventCategory: searchTypeEvent.value
      });
    } else {
      fetchEvents();
    }
  }

  const handleFilterDate = async () => {
    if (filterStartEndDate.value) {
      const [startDate, endDate] = filterStartEndDate.value;

      if (startDate && endDate) {
        await eventStore.fetchEvents(
          {
            q: searchQuery.value.trim(),
            eventCategory: searchTypeEvent.value,
            startDate: startDate.toString(),
            endDate: endDate.toString()
          }
        );
      } else {
        fetchEvents();
      }
    }
  }

  watch(currentPage, (page) => {
    eventStore.fetchEvents({page: page, pageSize: PAGE_SIZE});
  });

  onMounted(async () => {
    eventStore.fetchEvents({currentPage: currentPage.value, pageSize: PAGE_SIZE});

    // khởi tạo danh sách loại sự kiện
    const resultEventCategories = await eventCategoriesStore.fetchEventCategories();
    eventCategoriesOptions.value = resultEventCategories.map((d) => {
      return {
        id: d._id,
        name: d.name
      }
    });
  });
</script>
