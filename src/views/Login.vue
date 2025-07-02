<template>
  <div class="login-page bg-[#ededed] h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto">
      <div class="">
        <img class="mx-auto h-10 w-auto" src="../assets/logo-cs.png" alt="MasterX" />
        <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Đăng nhập hệ thống</h2>
      </div>

      <div class="mt-6">
        <form class="space-y-6" action="#" method="POST" @submit="checkValidateLogin">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email <span class="text-sm text-red-500">*</span></label>
            <div class="mt-2">
              <input v-model="email" type="email" name="email" id="email" autocomplete="email" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              <p v-if="errorEmail" class="text-xs text-red-500 mt-1">{{ errorEmail }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Mật khẩu <span class="text-sm text-red-500">*</span></label>
            <div class="mt-2">
              <input type="password" name="password" id="password" autocomplete="password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" v-model="password" />
              <p v-if="errorPassword" class="text-xs text-red-500 mt-1">{{ errorPassword }}</p>
            </div>
          </div>

          <div>
            <button 
            type="submit" 
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Đăng nhập</button>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <router-link to="/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu</router-link>
            </div>

            <div class="text-sm">
              <router-link to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Bạn chưa có tài khoản?</router-link>
            </div>
          </div>

          <div v-if="errorApi" class="block w-full bg-red-100 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-red-500 shadow-xs">
            {{ errorApi }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import axios from 'axios';
  import { ref } from 'vue';

  const router = useRouter();
  const auth = useAuthStore();
  const email = ref('');
  const password = ref('');

  // errors state
  const errorEmail = ref('');
  const errorPassword = ref('');
  const errorApi = ref();

  function validateEmailError(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }
  
  function checkValidateLogin(event) {
    event.preventDefault();
    // Kiểm tra tính hợp lệ form
    let isValid = true;
    
    // reset errors
    errorEmail.value = '';
    errorPassword.value = '';

    if (!email.value) {
      errorEmail.value = 'Vui lòng nhập email';
      isValid = false;
    } else if (!validateEmailError(email.value)) {
      errorEmail.value = 'Email không hợp lệ';
      isValid = false;
    }

    if (!password.value) {
      errorPassword.value = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    // Pass form
    if (isValid) {
      handleLogin();
    }
  }

  async function handleLogin() {
    try {
      errorApi.value = '';

      const response = await axios.post('auth/login', {
        email: email.value,
        password: password.value
      });

      auth.login({
        user: response.data.data.user,
        token: response.data.data.tokens.accessToken
      });
      
      router.push('/');
    } catch (error) {
      console.error('Login failed: ', error);
      errorApi.value = error.response.data.message;
    }
  }
</script>
