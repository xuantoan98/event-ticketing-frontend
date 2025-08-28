<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="(val) => emit('update:visible', val)"
    :title="isEdit ? 'Cập nhật phòng ban' : 'Thêm phòng ban'"
    width="70%"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
      <el-form-item label="Tên phòng ban" prop="name">
        <el-input v-model="form.name" :disabled="!allowUpdate" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" :disabled="!allowUpdate" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="form.phone" :disabled="!allowUpdate" />
      </el-form-item>
      <el-form-item label="Trạng thái" prop="status">
        <el-select v-model="form.status" placeholder="Trạng thái" :disabled="!allowUpdate">
          <el-option label="Hoạt động" :value="1" />
          <el-option label="Ngưng hoạt động" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="form.description" :disabled="!allowUpdate" />
      </el-form-item>
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
  import { ref, watch, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useDepartmentStore } from '../../stores/department';

  const departmentStore = useDepartmentStore();
  const props = defineProps({
    visible: Boolean,
    department: Object,
    isAllowUpdate: Boolean,
    currentPage: Number
  });

  const emit = defineEmits(['update:visible', 'refresh']);
  const isEdit = ref(false);
  const formRef = ref();
  const allowUpdate = ref(false);
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    description: '',
    status: 1
  });

  const rules = {
    name: [{ required: true, message: 'Tên phòng ban là bắt buộc', trigger: 'blur' }],
    email: [
      { required: true, message: 'Email là bắt buộc', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ]
  };

  // Nếu props.department thay đổi (tức là đang chỉnh sửa)
  watch(() => props.visible, (val) => {
    if (val && props.department) {
      isEdit.value = true;
      Object.assign(form, props.department);
    } else {
      resetForm();
    }

    allowUpdate.value = props.isAllowUpdate;
  });

  function resetForm() {
    isEdit.value = false;
    formRef.value?.resetFields();
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      description: '',
      status: ''
    });
  }

  function handleClose() {
    resetForm();
    emit('update:visible', false);
  }

  function submitForm() {
    formRef.value.validate(async (valid) => {
      if (!valid) return;

      try {
        if (isEdit.value && props.department?._id) {
          await departmentStore.updateDepartment(props.department._id, { ...form });
          ElMessage.success('Cập nhật thành công');
        } else {
          await departmentStore.addDepartment({ ...form });
          ElMessage.success('Thêm mới thành công');
        }

        emit('refresh', props.currentPage);
        handleClose();
        console.log('debug: ', props.currentPage);
        
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Đã xảy ra lỗi');
      }
    });
  }
</script>

<style>
  .el-dialog {
    padding: 24px;
  }
</style>
