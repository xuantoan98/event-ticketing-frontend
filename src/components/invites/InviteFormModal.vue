<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="(val) => { emit('update:visible', val) }"
    :title="isEdit ? 'Cập nhật khách mời' : 'Thêm khách mời'"
    width="70%"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Tên khách mời" prop="name">
          <el-input v-model="form.name" placeholder="Tên khách mời" :disabled="!allowUpdate"/>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email" :disabled="!allowUpdate" />
        </el-form-item>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Số điện thoại" prop="phone">
          <el-input v-model="form.phone" placeholder="Số điện thoại" :disabled="!allowUpdate" />
        </el-form-item>
        <el-form-item label="Fax" prop="fax">
          <el-input v-model="form.fax" placeholder="Số fax" :disabled="!allowUpdate" />
        </el-form-item>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Cơ quan" prop="organization">
          <el-input v-model="form.organization" placeholder="Cơ quan" :disabled="!allowUpdate" />
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <el-select v-model="form.status" placeholder="Trạng thái" :key="form.status" :disabled="!allowUpdate">
            <el-option label="Hoạt động" :value="1" />
            <el-option label="Ngưng hoạt động" :value="0" />
          </el-select>
        </el-form-item>
      </div>
      <!-- <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item> -->
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">Hủy</el-button>
      <el-button type="primary" @click="submitForm" :disabled="!allowUpdate">
        {{ isEdit ? 'Cập nhật' : 'Lưu' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { reactive, ref, watch } from 'vue';
  import { useInviteStore } from '../../stores/invite';
  import { ElMessage } from 'element-plus';

  const inviteStore = useInviteStore();

  // định nghĩa props visible: ẩn hiện modal, inviteData cho việc phân biệt modal add và update
  const props = defineProps({
    visible: Boolean,
    inviteData: Object,
    isAllowUpdate: Boolean,
    currentPage: Number
  });

  // định nghĩa các sự kiện cho modal
  const emit = defineEmits(['update:visible', 'refresh']);

  // định nghĩa các biến phản ứng (ref, reactive)
  const isEdit = ref(false);
  const allowUpdate = ref(false);
  const formRef = ref();
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    fax: '',
    organization: '',
    status: 1
  });

  const rules = {
    name: [{ required: true, message: 'Tên là bắt buộc', trigger: 'blur' }],
    email: [{ required: true, message: 'Email là bắt buộc', trigger: 'blur' }],
    phone: [{ required: true, message: 'Số điện thoại là bắt buộc', trigger: 'blur' }]
  };

  function submitForm() {
    formRef.value.validate(async (valid) => {
      if (!valid) {
        return;
      }

      try {
        if (isEdit.value && props.inviteData?._id) {
          await inviteStore.updateInvite(props.inviteData?._id, { ...form });
          ElMessage.success('Cập nhật thành công');
        } else {
          await inviteStore.addInvite({ ...form });
          ElMessage.success('Thêm mới thành công');
        }

        emit('refresh', props.currentPage);
        handleClose();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  function handleClose() {
    resetForm();
    emit('update:visible', false);
  }

  function resetForm() {
    isEdit.value = false;
    formRef.value?.resetFields();
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      fax: '',
      organization: ''
    });
  }

  // Lắng nghe sự tay đổi của props.visible để xác định xem có đang chỉnh sửa hay thêm mới
  watch(
    () => props.visible,
    (val) => {
      if (val && props.inviteData) {
        isEdit.value = true;
        Object.assign(form, props.inviteData);
      } else {
        resetForm();
      }

      allowUpdate.value = props.isAllowUpdate;
    }
  );
</script>
