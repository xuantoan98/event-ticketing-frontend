<template>
  <div class="flex items-center justify-between">
    <h2>Danh sách khách mời</h2>

    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        :suffix-icon="Search"
        @input="handleSearchInvite"
      />
      <el-button type="primary" @click="openAddModal">
        <el-icon class="mr-1"><Plus /></el-icon>
        Thêm mới
      </el-button>
    </div>
  </div>

  <div>
    <el-table :data="inviteStore.invites" v-loading="inviteStore.loading">
      <el-table-column prop="name" label="Tên khách mời" />
      <el-table-column prop="email" label="Email" show-overflow-tooltip />
      <el-table-column prop="phone" label="Số điện thoại" />
      <!-- <el-table-column prop="fax" label="Số fax" /> -->
      <el-table-column prop="organization" label="Cơ quan" show-overflow-tooltip />
      <!-- <el-table-column prop="description" label="Mô tả" /> -->
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
            @click="deleteInvite(row._id)"
            :loading="deletingId === row._id"
          >Xóa</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="text-gray-500 text-sm italic text-center py-6">
          Dữ liệu khách mời trống.
        </div>
      </template>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="inviteStore.total"
        layout="prev, pager, next"
      />
    </div>
  </div>

  <InviteFormModal 
    v-model:visible="showModal"
    :inviteData="editingInvite"
    @refresh="fetchInvites"
  />
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useInviteStore } from '../../stores/invite';
  import { Search } from '@element-plus/icons-vue';
  import { debounce } from 'lodash';
  import InviteFormModal from '../../components/invites/InviteFormModal.vue';
  import { DEFAULT_PAGE, DEFAULT_SORT, PAGE_SIZE } from '../../constants';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const inviteStore = useInviteStore();

  const searchQuery = ref('');
  const showModal = ref(false);
  const editingInvite = ref(null);
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(PAGE_SIZE);
  const deletingId = ref(null);

  async function handleSearchResult() {
    if (searchQuery.value.trim()) {
      await inviteStore.getInvites(currentPage.value, PAGE_SIZE, DEFAULT_SORT.order, searchQuery.value.trim());
    } else {
      // If search query is empty, fetch all invites
      fetchInvites();
    }
  }

  const handleSearchInvite = debounce(handleSearchResult, 500);

  function openAddModal() {
    editingInvite.value = null;
    showModal.value = true;
  }

  function openEditModal(invite) {    
    editingInvite.value = invite;
    showModal.value = true;
  }

  async function deleteInvite(inviteId) {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn dừng hoạt động khách mời này?',
        'Xác nhận',
        {
          confirmButtonText: 'Dừng',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      );

      deletingId.value = inviteId;
      const result = await inviteStore.deleteInvite(inviteId);
      deletingId.value = null;

      if (result.status === 200) {
        ElMessage.success('Thay đổi trạng thái khách mời thành công.');
        fetchInvites();
      } else {
        ElMessage.error('Thay đổi trạng thái khách mời thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {}
  }

  const fetchInvites = async () => {
    await inviteStore.getInvites();
  }

  watch(currentPage, (page) => {
    inviteStore.getInvites(page, PAGE_SIZE);
  });

  onMounted(() => {
    inviteStore.getInvites(currentPage.value, PAGE_SIZE);
  });
</script>