<template>
  <div class="login-page bg-[#ededed] h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto">
      <div class="">
        <img class="mx-auto h-10 w-auto" src="../assets/logo-cs.png" alt="MasterX" />
        <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Đăng nhập hệ thống</h2>
      </div>

      <div class="mt-6">
        <el-form class="space-y-6" action="#" method="POST" @submit.prevent="onSubmit">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email <span class="text-sm text-red-500">*</span></label>
            <div class="mt-2">
              <el-input v-model="email" type="email" name="email" id="email" autocomplete="email" placeholder="Email" />
              <p class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Mật khẩu <span class="text-sm text-red-500">*</span></label>
            <div class="mt-2">
              <el-input type="password" name="password" id="password" autocomplete="password" placeholder="Mật khẩu" v-model="password" show-password />
              <p class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
            </div>
          </div>

          <div>
            <el-button type="primary" native-type="submit" class="w-full">
              Đăng nhập
            </el-button>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <router-link to="/forgot-password" class="text-gray-900 hover:opacity-[0.8]">
                Quên mật khẩu
              </router-link>
            </div>

            <div class="text-sm">
              <router-link to="/register" class="text-gray-900 hover:opacity-[0.8]">Bạn chưa có tài khoản?</router-link>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import axios from '../utils/axios';
  import { ElMessage } from 'element-plus';
  import * as yup from 'yup';
  import { useForm, useField } from 'vee-validate';

  const router = useRouter();
  const auth = useAuthStore();

  const schema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu ít nhất 6 ký tự')
  });
  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: email } = useField('email');
  const { value: password } = useField('password');

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await axios.post('auth/login', values);

      auth.login({
        user: response.data.data.user,
        token: response.data.data.tokens.accessToken
      });

      ElMessage({
        message: response.data.message || 'Xảy ra lỗi',
        type: 'success',
        grouping: true
      });
      
      router.push('/');
    } catch (error) {
      ElMessage({
        message: error.response.data.message || 'Xảy ra lỗi',
        type: 'error',
        grouping: true
      });
    }
  });
</script>
