<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="(val) => emit('update:visible', val)"
    :title="isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục'"
    width="70%"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
      <el-form-item label="Tên danh mục" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Trạng thái" prop="status">
        <el-select v-model="form.status" placeholder="Trạng thái" :key="form.status">
          <el-option label="Hoạt động" :value="1" />
          <el-option label="Ngưng hoạt động" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">Hủy</el-button>
      <el-button type="primary" @click="submitForm">
        {{ isEdit ? 'Cập nhật' : 'Lưu' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, watch, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useEventCategoriesStore } from '../../stores/eventCategories';

  const eventCategoriesStore = useEventCategoriesStore();
  const props = defineProps({
    visible: Boolean,
    eventCategory: Object
  });

  const emit = defineEmits(['update:visible', 'refresh']);
  const isEdit = ref(false);
  const formRef = ref();
  const form = reactive({
    name: '',
    description: '',
    status: 1
  });

  const rules = {
    name: [{ required: true, message: 'Tên danh mục là bắt buộc', trigger: 'blur' }]
  };

  function resetForm() {
    isEdit.value = false;
    formRef.value?.resetFields();
    Object.assign(form, {
      name: '',
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
      if (!valid) {
        return;
      }

      try {
        if (isEdit.value && props.eventCategory?._id) {
          await eventCategoriesStore.updateEventCategory(props.eventCategory._id, { ...form });
          ElMessage.success('Cập nhật thành công');
        } else {
          await eventCategoriesStore.addEventCategory({ ...form });
          ElMessage.success('Thêm mới thành công');
        }

        emit('refresh');
        handleClose();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  // Nếu props.eventCategory thay đổi -> đang sửa danh mục
  watch(
    () => props.visible,
    (val) => {
      if (val && props.eventCategory) {
        isEdit.value = true;
        Object.assign(form, props.eventCategory);
      } else {
        resetForm();
      }
    }
  );
</script>
