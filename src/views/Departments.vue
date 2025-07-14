<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách phòng ban</h2>

    <el-button type="primary" @click="openAddModal">
      <el-icon class="mr-1"><Plus /></el-icon>
      Thêm mới
    </el-button>
  </div>

  <div>
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
      <el-table-column prop="createdAt" label="Ngày tạo">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
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

  const departmentStore = useDepartmentStore();
  const currentPage = ref(1);
  const pageSize = 10;

  const showModal = ref(false);
  const editingDepartment = ref(null);

  watch(currentPage, (page) => {
    departmentStore.fetchDepartments(page, pageSize);
  });

  onMounted(() => {
    departmentStore.fetchDepartments(currentPage.value, pageSize);
  });

  const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

  const fetchDepartments = () => {
    departmentStore.fetchDepartments();
  }

  function openAddModal() {
    editingDepartment.value = null; // tạo mới
    showModal.value = true;
  }
</script>