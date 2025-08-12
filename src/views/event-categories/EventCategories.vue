<template>
  <div class="flex items-center justify-between">
    <h2>Các danh mục sự kiện</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
        @input="handleSearchEventCategory"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div>
    <el-table :data="eventCategoriesStore.eventCategories" v-loading="eventCategoriesStore.loading">
      <el-table-column prop="name" label="Tên danh mục" />
      <el-table-column prop="description" label="Mô tả" />
      <el-table-column label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="plain">
            {{ row.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Hành động">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="openEditModal(row)">Sửa</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="deleteEventCategory(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="text-gray-500 text-sm italic text-center py-6">
          Dữ liệu danh mục trống.
        </div>
      </template>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="eventCategoriesStore.total"
        layout="prev, pager, next"
      />
    </div>
  </div>

  <EventCategoriesFormModal 
    v-model:visible="showModal"
    :eventCategory="editingEventCategory"
    @refresh="fetchEventCategories"
  />

</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useEventCategoriesStore } from '../../stores/eventCategories';
  import { debounce } from 'lodash';
  import { Search } from '@element-plus/icons-vue';
  import EventCategoriesFormModal from '../../components/event-categories/EventCategoriesFormModal.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const eventCategoriesStore = useEventCategoriesStore();

  const currentPage = ref(1);
  const pageSize = 10;
  const searchQuery = ref('');
  const deletingId = ref(null);
  const showModal = ref(false);
  const editingEventCategory = ref(null);

  const fetchEventCategories = async () => {
    await eventCategoriesStore.fetchEventCategories();
  }

  const handleSearchEventCategory = debounce(fetchSearchResult, 500);

  async function fetchSearchResult() {
    await eventCategoriesStore.fetchEventCategories(1, 10, 'desc', searchQuery.value.trim());
  }

  function openAddModal () {
    editingEventCategory.value = null; // tạo mới
    showModal.value = true;
  }

  function openEditModal(eventCategory) {
    editingEventCategory.value = {...eventCategory}; // cập nhật
    showModal.value = true;
  }

  async function deleteEventCategory(id) {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn dừng hoạt động danh mục này?',
        'Xác nhận',
        {
          confirmButtonText: 'Dừng',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      );

      deletingId.value = id;
      const result = await eventCategoriesStore.deleteEventCategory(id);    
      deletingId.value = null;

      if (result.status === 200) {
        ElMessage.success('Thay đổi trạng thái thành công');
        await eventCategoriesStore.fetchEventCategories();
      } else {
        ElMessage.error('Thay đổi trạng thái thất bại');
      }
    } catch (error) {}
  }

  watch(currentPage, (page) => {
    eventCategoriesStore.fetchEventCategories(page, pageSize);
  });

  onMounted(() => {
    eventCategoriesStore.fetchEventCategories(currentPage.value, pageSize);
  });
</script>
