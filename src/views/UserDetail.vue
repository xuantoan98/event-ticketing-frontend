<template>
  <div>
    <!-- banner user -->
    <div class="block w-full h-[100px]">
      <img class="w-full h-full object-cover block rounded-t-sm" src="../assets/user-banner.jpg" alt="">
    </div>

    <!-- info user -->
    <div class="block mt-4 w-full">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <img v-if="auth.user.avatar" :src="auth.user.avatar" alt="Avatar" class="w-16 h-16 rounded-full object-cover" />
          <img v-else src="../assets/vue.svg" alt="Avatar" class="w-16 h-16 rounded-full object-cover" />

          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ auth.user.name }}</h2>
            <p class="text-sm text-gray-500">{{ auth.user.email }}</p>
            <p class="text-sm text-gray-500 mt-2">
              <el-tag
                v-if="auth.user.status === 1"
                type="success"
                round
              >
                Đang hoạt động
              </el-tag>

              <el-tag
                v-else
                type="warning"
                round
              >
                Ngừng hoạt động
              </el-tag>
            </p>
          </div>
        </div>
        <el-button type="primary" @click="toggleEdit">
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>

      <el-form class="grid gap-6" action="#" method="POST" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Tên người dùng</label>
            <el-input v-model="name" type="text" placeholder="Tên người dùng" :disabled="!isEdit" />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
          </div>
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Email</label>
            <el-input v-model="email" type="text" placeholder="Email" :disabled="!isEdit" />
            <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>

          <!-- Row 2 -->
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Giới tính</label>
            <el-select v-model="gender" placeholder="Giới tính" :disabled="!isEdit">
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Ngày sinh</label>
            <el-date-picker
              v-model="dateOfBirth"
              type="date"
              placeholder="Ngày sinh"
              style="width: 100%;"
              :disabled="!isEdit"
            />
          </div>

          <!-- Row 3 -->
          <div>
            <label for="phone" class="block text-sm/6 font-medium text-gray-900">Số điện thoại <span class="text-sm text-red-500">*</span></label>
            <div class="mt-1">
              <el-input v-model="phone" type="text" name="phone" id="phone" autocomplete="phone" placeholder="Số điện thoại" :disabled="!isEdit" />
              <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm/6 font-medium text-gray-900">Chức vụ</label>
            <div class="mt-1">
              <el-input v-model="userRole" type="text" name="role" id="role" autocomplete="role" placeholder="Chức vụ" disabled />
            </div>
          </div>
        </div>

        <div class="w-full">
          <label for="address" class="block text-sm/6 font-medium text-gray-900">Địa chỉ</label>
          <div class="mt-1">
            <el-input v-model="address" type="text" name="address" id="address" placeholder="Địa chỉ" autocomplete="address" :disabled="!isEdit" />
          </div>
        </div>

        <div class="w-full">
          <div class="mt-1">
            <el-button 
              type="primary"
              native-type="submit"
              class="w-full"
              :disabled="!isEdit"
              :loading="loading"
            >
              Lưu thay đổi
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useGenderOptionsStore } from '../stores/genderOptions';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { ElMessage } from 'element-plus';
  import axios from '../utils/axios';

  const schema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    name: yup.string().required('Tên người dùng là bắt buộc'),
    phone: yup.string().required('Số điện thoại là bắt buộc'),
    dateOfBirth: yup.date().nullable(),
    gender: yup.string().nullable(),
    address: yup.string().nullable()
  });

  const auth = useAuthStore();
  const genderOptionsStore = useGenderOptionsStore();
  const genderOptions = genderOptionsStore.genderOptions;
  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: email } = useField('email');
  const { value: name } = useField('name');
  const { value: phone } = useField('phone');
  const { value: dateOfBirth } = useField('dateOfBirth');
  const { value: gender } = useField('gender');
  const { value: address } = useField('address');
  const isEdit = ref(false);
  const loading = ref(false);
  
  onMounted(() => {
    if (auth.user) {
      email.value = auth.user.email || '';
      name.value = auth.user.name || '';
      phone.value = auth.user.phone || '';
      dateOfBirth.value = auth.user.dateOfBirth || '';
      gender.value = auth.user.gender || '';
      address.value = auth.user.address || '';
    }
  });

  const userRole = computed(() => {
    switch (auth.user.role) {
    case 'admin':
      return 'Quản trị viên';
    case 'employee':
      return 'Nhân viên';
    case 'customer':
      return 'Khách hàng';
    default:
      return 'Không xác định';
    }
  });

  const onSubmit = handleSubmit (async (values) => {
    try {
      loading.value = true;
      // Call api update user
      const response = await axios.put(`users/update/${auth.user.id}`, {
        ...values
      });

      if (response.status === 200) {
        auth.updateUser(response.data.data);
        ElMessage({
          message: response.data.message || 'Xảy ra lỗi',
          type: 'success',
          grouping: true
        });
      } else {
        ElMessage.error('Có lỗi xảy ra!');
      }

      isEdit.value = false;
      loading.value = false;
    } catch (error) {
      ElMessage({
        message: error.response.data.message || 'Lỗi cập nhật'
      });
    }
  });

  const toggleEdit = () => {
    isEdit.value = true;
  }
</script>