<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="(val) => { emit('update:visible', val) }"
    :title="isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng'"
    width="70%"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Họ và tên" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Số điện thoại" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="Ngày sinh" prop="dateOfBirth">
          <el-date-picker
              v-model="form.dateOfBirth"
              type="date"
              placeholder="Ngày sinh"
              style="width: 100%;"
            />
        </el-form-item>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Giới tính" prop="gender">
          <el-select v-model="form.gender" placeholder="Giới tính">
            <el-option
              v-for="item in genderOptionsStore.genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <el-select v-model="form.status" placeholder="Trạng thái" :key="form.status">
            <el-option label="Hoạt động" :value="1" />
            <el-option label="Ngưng hoạt động" :value="0" />
          </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Phòng ban" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="Phòng ban" :key="form.departmentId" filterable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Chức vụ" prop="role">
          <el-select v-model="form.role" placeholder="Chức vụ" :key="form.role">
            <el-option label="Nhân viên" value="employee" />
            <el-option label="Khách mời" value="customer" />
          </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-center w-full mb-[18px] rounded-sm border border-dashed py-4">
        <div 
          class="flex items-center justify-center w-full h-full  cursor-pointer group"
          @click="triggerFileSelect"
          >
          <div class="flex flex-col items-center justify-center gap-4">
            <el-icon size="large"><Plus /></el-icon>
            <p>
              Chọn ảnh đại diện
            </p>
          </div>
        </div>

        <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="avatar" class="w-[80px] h-[80px] rounded-full object-cover" />
        <p v-else class="text-gray-500 text-sm">Ảnh xem trước</p>

        <!-- Input ẩn để chọn ảnh -->
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref="fileInput"
          class="hidden"
          @change="handleAvatarChange"
        />
      </div>
      <div>
        <el-mention
          v-model="form.address"
          type="textarea"
          style="width: 100%"
          placeholder="Địa chỉ"
        />
      </div>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">Hủy</el-button>
      <el-button :loading="userStore.loading" type="primary" @click="submitForm">
        {{ isEdit ? 'Cập nhật' : 'Lưu' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useUserStore } from '../../stores/user';
  import { useDepartmentStore } from '../../stores/department';
  import { useGenderOptionsStore } from '../../stores/genderOptions';
  import axios from '../../utils/axios';
  import { ElMessage } from 'element-plus';

  const userStore = useUserStore();
  const departmentStore = useDepartmentStore();
  const genderOptionsStore = useGenderOptionsStore();

  // định nghĩa props visible: ẩn hiện modal, userData cho việc phân biệt modal add và update
  const props = defineProps({
    visible: Boolean,
    userData: Object
  });

  // định nghĩa các sự kiện cho modal
  const emit = defineEmits(['update:visible', 'refresh']);

  const isEdit = ref(false);
  const loading = ref(false);
  const formRef = ref();
  const fileInput = ref(null);
  // const avatarUrl = ref(authStore.user.avatar || 'src/assets/default-avatar-icon.jpg');
  const avatarFile = ref(null);
  const avatarPreviewUrl = ref(null);
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    status: 1,
    departmentId: '',
    role: 'customer',
    address: '',
    avatar: ''
  });
  const rules = {
    name: [{ required: true, message: 'Tên là bắt buộc', trigger: 'blur' }],
    email: [
      { required: true, message: 'Email là bắt buộc', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
    phone: [{ required: true, message: 'Số điện thoại là bắt buộc', trigger: 'blur' }],
    departmentId: [{ required: true, message: 'Phòng ban là bắt buộc', trigger: 'change' }],
    role: [{ required: true, message: 'Chức vụ là bắt buộc', trigger: 'change' }]
  };
  const departmentOptions = ref([]);
  
  function handleClose() {
    emit('update:visible', false)
    resetForm();
  }

  async function submitForm() {
    loading.value = true;
    
    formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {

        let avatarPath = form.avatar;
        if (avatarFile.value) {
          const formData = new FormData();
          formData.append('avatar', avatarFile.value);

          const res = await axios.post('/upload-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (res.status === 200) {
            avatarPath = res.data.data.path;
          } else {
            ElMessage.error('Tải ảnh thất bại');
            return;
          }
        }

        const payload = {
          ...form,
          avatar: avatarPath,
        }

        if (isEdit.value && props.userData?._id) {
          await userStore.updateUser(props.userData?._id, payload);
          ElMessage.success('Cập nhật thành công');
        } else {
          await userStore.addUser(payload);
          ElMessage.success('Thêm mới thành công');
        }

        loading.value = false;
        emit('refresh');
        handleClose();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  function resetForm() {
    isEdit.value = false;
    avatarPreviewUrl.value = null;
    formRef.value?.resetFields();
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      status: 1,
      departmentId: '',
      role: 'customer',
      address: '',
      avatar: ''
    });
  }

  // kích hoạt input file để chọn ảnh
  function triggerFileSelect() {
    fileInput.value?.click();
  }

  async function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    avatarFile.value = file
    avatarPreviewUrl.value = URL.createObjectURL(file)

    return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {        
        avatarUrl.value = response.data.data.path || '';
        form.avatar = response.data.data.path; // Cập nhật đường dẫn ảnh vào form
        ElMessage.success('Tải ảnh lên thành công');
      } else {
        ElMessage.error('Tải ảnh lên thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
    }
  }

  onMounted(async () => {
    const resultDepartments = await departmentStore.fetchDepartments();
    departmentOptions.value = resultDepartments.map((d) => {
      return {
        id: d._id,
        name: d.name
      }
    });
  });
</script>

<style>
  .group:hover .group-hover\:opacity-100 {
    opacity: 0.8;
  }
</style>
