<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách người dùng</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
        @input="handleSearchUsers"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div class="mt-4">
    <el-table :data="userStore.users" v-loading="userStore.loading">
      <el-table-column prop="avatar" label="Avatar" width="100">
        <template #default="{ row }">
          <div class="flex items-center justify-center p-1 border border-dashed rounded-full w-[60px] h-[60px]">
            <img class="rounded-full w-full h-full object-cover block" :src="row.avatar || 'src/assets/default-avatar-icon.jpg'" loading="lazy" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Họ và tên" />
      <el-table-column prop="email" label="Email" show-overflow-tooltip />
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
        <template #default="{ row }">
          <el-button v-if="auth.user.id === row.createdBy" type="warning" size="small" @click="openEditModal(row, true)">Sửa</el-button>
          <el-button v-else type="primary" size="small" @click="openEditModal(row, false)">xem</el-button>
          <el-button
            v-if="auth.user.id === row.createdBy"
            type="danger" 
            size="small" 
            @click="deleteUser(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template>
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
    :userData="editingUser"
    :current-page="currentPage"
    :is-allow-update="allowUpdate"
    @refresh="fetchPaginationUsers"
  />
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useUserStore } from '../../stores/user';
  import { DEFAULT_PAGE, DEFAULT_SORT, PAGE_SIZE } from '../../constants';
  import { Search } from '@element-plus/icons-vue';
  import { formatRole } from '../../utils/formatter';
  import UserFormModal from '../../components/users/UserFormModal.vue';
  import { debounce } from 'lodash';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useAuthStore } from '../../stores/auth';

  const userStore = useUserStore();
  const auth = useAuthStore();
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(PAGE_SIZE);
  const showModal = ref(false);
  const editingUser = ref(null);
  const searchQuery = ref('');
  const deletingId = ref(null);
  const allowUpdate = ref(false);

  onMounted(() => {
    userStore.fetchPaginationUsers(currentPage.value, PAGE_SIZE);
  });

  watch(currentPage, (page) => {
    userStore.fetchPaginationUsers(page, PAGE_SIZE)
  });

  async function handleSearchResult() {
    if (searchQuery.value.trim()) {
      await userStore.fetchPaginationUsers(currentPage.value, PAGE_SIZE, DEFAULT_SORT.order, searchQuery.value.trim());
    } else {
      fetchPaginationUsers();
    }
  }

  const handleSearchUsers = debounce(handleSearchResult, 500);

  async function fetchPaginationUsers(page = 1) {
    await userStore.fetchPaginationUsers(page, PAGE_SIZE);
  }

  function openAddModal() {
    showModal.value = true;
    editingUser.value = null;
    allowUpdate.value = true;
  }

  function openEditModal(user, isAllowUpdate = false) {
    editingUser.value = { ...user };
    showModal.value = true;
    allowUpdate.value = isAllowUpdate;
  }

  const fetchUsers = async () => {
    await userStore.fetchUsers();
  }

  async function deleteUser(userId) {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn dừng hoạt động người dùng này?',
        'Xác nhận',
        {
          confirmButtonText: 'Dừng',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      );

      deletingId.value = userId;
      const result = await userStore.deleteUser(userId);
      deletingId.value = null;
      
      if (result.status === 200) {
        ElMessage.success('Thay đổi trạng thái người dùng thành công.');
        fetchPaginationUsers();
      } else {
        ElMessage.error('Thay đổi trạng thái người dùng thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {}
  }
</script>