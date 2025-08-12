<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách phòng ban</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
        @input="handleSearchDepartment"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div class="mt-4">
    <el-table :data="departmentStore.departments" v-loading="departmentStore.loading">
      <el-table-column prop="name" label="Tên phòng ban" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="phone" label="SĐT" />
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
          <el-button type="primary" size="small" @click="openEditModal(row)">Sửa</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="deleteDepartment(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="text-gray-500 text-sm italic text-center py-6">
          Dữ liệu phòng ban trống.
        </div>
      </template>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="departmentStore.total"
        layout="prev, pager, next"
      />
    </div>
  </div>

  <DepartmentFormModal
    v-model:visible="showModal"
    :department="editingDepartment"
    @refresh="fetchDepartments"
  />
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useDepartmentStore } from '../stores/department';
  import DepartmentFormModal from '../components/layouts/DepartmentFormModal.vue';
  import { Search } from '@element-plus/icons-vue';
  import { debounce } from 'lodash';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const departmentStore = useDepartmentStore();

  const currentPage = ref(1);
  const pageSize = 10;
  const showModal = ref(false);
  const editingDepartment = ref(null);
  const searchQuery = ref('');
  const deletingId = ref(null);

  watch(currentPage, (page) => {
    departmentStore.fetchDepartments(page, pageSize);
  });

  onMounted(() => {
    departmentStore.fetchDepartments(currentPage.value, pageSize);
  });

  const fetchDepartments = async () => {
    await departmentStore.fetchDepartments();
  }

  function openAddModal() {
    editingDepartment.value = null; // tạo mới
    showModal.value = true;
  }

  function openEditModal(department) {
    editingDepartment.value = { ...department };
    showModal.value = true;
  }

  const deleteDepartment = async (id) => {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn dừng hoạt động phòng ban này?',
        'Xác nhận',
        {
          confirmButtonText: 'Dừng',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      );

      deletingId.value = id;
      const result = await departmentStore.deleteDepartment(id);
      deletingId.value = null;

      if (result.status === 200) {
        ElMessage.success('Thay đổi trạng thái thành công');
        await departmentStore.fetchDepartments();
      } else {
        ElMessage.error('Thay đổi trạng thái thất bại');
      }
    } catch (error) {}
  }

  async function fetchSearchResult() {
    await departmentStore.fetchDepartments(1, 10, 'desc', searchQuery.value);
  }

  const handleSearchDepartment = debounce(fetchSearchResult, 500);
</script>
