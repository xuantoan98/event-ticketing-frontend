<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách người dùng</h2>

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
    <el-table :data="userStore.users" v-loading="userStore.loading">
      <el-table-column prop="avatar" label="Avatar" width="100">
        <template #default="{ row }">
          <div class="flex items-center justify-center p-1 border border-dashed rounded-full w-[60px] h-[60px]">
            <img class="rounded-full w-full h-full object-cover block" :src="row.avatar || 'src/assets/default-avatar-icon.jpg'" loading="lazy" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Họ và tên" />
      <el-table-column prop="email" label="Email" show-overflow-tooltip pro />
      <el-table-column prop="role" label="Chức vụ">
        <template #default="{ row }">
          <el-tag v-if="row.role === 'admin'" type="danger" effect="plain">
            {{ formatRole(row.role) }}
          </el-tag>
          <el-tag v-if="row.role === 'customer'" type="info" effect="plain">
            {{ formatRole(row.role) }}
          </el-tag>
          <el-tag v-if="row.role === 'employee'" type="primary" effect="plain">
            {{ formatRole(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Sinh nhật">
        <template #default="{ row }">
          {{ formatDate(row.dateOfBirth) }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="address" label="Địa chỉ" /> -->
      <el-table-column prop="phone" label="Số điện thoại">
        <template #default="{ row }">
          {{ row.phone || '---' }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="gender" label="Giới tính" /> -->
      <el-table-column label="Phòng ban">
        <template #default="{ row }">
          {{ row.departmentId ? row.departmentId.name : '---' }}
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="plain">
            {{ row.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
          </el-tag>
        </template>
      </el-table-column>
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
          Dữ liệu người dùng trống.
        </div>
      </template>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        size="small"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="userStore.total"
        layout="prev, pager, next"
      />
    </div>
  </div>

  <UserFormModal
    v-model:visible="showModal"
    :department="editingUser"
    @refresh="fetchUsers"
  />
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useUserStore } from '../../stores/user';
  import { DEFAULT_PAGE, PAGE_SIZE } from '../../constants';
  import { Search } from '@element-plus/icons-vue';
  import { formatRole } from '../../utils/formatter';
  import UserFormModal from '../../components/users/UserFormModal.vue';

  const userStore = useUserStore();
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(PAGE_SIZE);
  const showModal = ref(false);
  const editingUser = ref(null);

  onMounted(() => {
    userStore.fetchUsers(currentPage.value, PAGE_SIZE);
  });

  watch(currentPage, (page) => {
    userStore.fetchUsers(page, PAGE_SIZE)
  });

  async function fetchUsers() {
    await userStore.fetchUsers();
  }

  function openAddModal() {
    showModal.value = true;
    editingUser.value = null;
  }
</script>