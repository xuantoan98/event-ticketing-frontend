<template>
  <div class="login-page bg-[#ededed] h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl mx-auto">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="../assets/logo-cs.png" alt="MasterX" />
        <h2 class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Đăng ký tài khoản</h2>
      </div>

      <div class="mt-6">
        <form class="space-y-4" action="#" method="POST" @submit.prevent="onSubmit">
          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="email" class="block text-sm/6 font-medium text-gray-900">Email <span class="text-sm text-red-500">*</span></label>
              <div class="mt-1">
                <input v-model="email" type="email" name="email" id="email" autocomplete="email" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                <p class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
              </div>
            </div>

            <div class="w-1/2">
              <label for="password" class="block text-sm/6 font-medium text-gray-900">Mật khẩu <span class="text-sm text-red-500">*</span></label>
              <div class="mt-1">
                <input type="password" name="password" id="password" autocomplete="current-password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" v-model="password" />
                <p class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="name" class="block text-sm/6 font-medium text-gray-900">Tên người dùng <span class="text-sm text-red-500">*</span></label>
              <div class="mt-1">
                <input v-model="name" type="text" name="name" id="name" autocomplete="name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                <p class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
              </div>
            </div>

            <div class="w-1/2">
              <label for="phone" class="block text-sm/6 font-medium text-gray-900">Số điện thoại <span class="text-sm text-red-500">*</span></label>
              <div class="mt-1">
                <input v-model="phone" type="text" name="phone" id="phone" autocomplete="phone" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                <p class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="dateOfBirth" class="block text-sm/6 font-medium text-gray-900">Năm sinh</label>
              <div class="mt-1">
                <el-date-picker
                  v-model="dateOfBirth"
                  type="date"
                  placeholder="Ngày sinh"
                  size="default"
                />
                <!-- <input v-model="dateOfBirth" type="date" name="dateOfBirth" id="dateOfBirth" autocomplete="email" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" /> -->
              </div>
            </div>

            <div class="w-1/2">
              <label for="gender" class="block text-sm/6 font-medium text-gray-900">Giới tính</label>
              <div class="mt-1">
                <el-select v-model="gender" placeholder="Giới tính" size="default">
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <!-- <select v-model="gender" name="gender" id="gender" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                  <option value="">----</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select> -->
              </div>
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm/6 font-medium text-gray-900">Địa chỉ</label>
            <div class="mt-1">
              <input v-model="address" type="text" name="address" id="address" autocomplete="address" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Đăng ký
            </button>
          </div>
          <div class="text-sm">
            <router-link to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
              <el-icon class="mr-2"><Back /></el-icon>
              Quay lại đăng nhập
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import * as yup from 'yup';
  import { useForm, useField } from 'vee-validate';
  import { ElMessage } from 'element-plus';
import { ref } from 'vue';

  // định nghĩa schema cho việc validate
  const schema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
    name: yup.string().required('Tên người dùng là bắt buộc'),
    phone: yup.string().required('Số điện thoại là bắt buộc'),
    dateOfBirth: yup.date().nullable(),
    gender: yup.string().nullable(),
    address: yup.string().nullable()
  });

  // Khởi tạo form voiws lib vee-validate
  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: email } = useField('email');
  const { value: password } = useField('password');
  const { value: name } = useField('name');
  const { value: phone } = useField('phone');
  const { value: dateOfBirth } = useField('dateOfBirth');
  const { value: gender } = useField('gender');
  const { value: address } = useField('address');
  const genderOptions = ref([
    {
      label: 'Nam',
      value: 'male'
    },
    {
      label: 'Nữ',
      value: 'demale'
    },
    {
      label: 'Khác',
      value: 'other'
    }
  ]);

  const router = useRouter();
  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await axios.post('users/register', {
        ...values,
        role: 'customer'
      });

      if (response.status === 201) {
        ElMessage({
          message: response.data.message || 'Xảy ra lỗi',
          type: 'success',
          grouping: true
        });

        router.push('/login');
      }
    } catch (error) {
      console.error('Đăng ký thất bại: ', error);
      ElMessage({
        message: error.response.data.message || 'Xảy ra lỗi'
      });
    }
  });
</script>
