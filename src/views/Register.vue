<template>
  <div class="login-page bg-[#ededed] h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl mx-auto">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="../assets/logo-cs.png" alt="MasterX" />
        <h2 class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Đăng ký tài khoản</h2>
      </div>

      <div class="mt-6">
        <form class="space-y-4" action="#" method="POST" @submit="checkValidateRegister">
          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="email" class="block text-sm/6 font-medium text-gray-900">Email</label>
              <div class="mt-1">
                <input v-model="email" type="email" name="email" id="email" autocomplete="email" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>

            <div class="w-1/2">
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm/6 font-medium text-gray-900">Mật khẩu</label>
              </div>
              <div class="mt-1">
                <input type="password" name="password" id="password" autocomplete="current-password" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" v-model="password" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="username" class="block text-sm/6 font-medium text-gray-900">Tên người dùng</label>
              <div class="mt-1">
                <input v-model="username" type="text" name="username" id="username" autocomplete="username" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>

            <div class="w-1/2">
              <label for="dateOfBirth" class="block text-sm/6 font-medium text-gray-900">Năm sinh</label>
              <div class="mt-1">
                <input v-model="dateOfBirth" type="date" name="dateOfBirth" id="dateOfBirth" autocomplete="email" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-1/2">
              <label for="phone" class="block text-sm/6 font-medium text-gray-900">Số điện thoại</label>
              <div class="mt-1">
                <input v-model="phone" type="text" name="number" id="number" autocomplete="number" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>

            <div class="w-1/2">
              <label for="gender" class="block text-sm/6 font-medium text-gray-900">Giới tính</label>
              <div class="mt-1">
                <select v-model="gender" name="gender" id="gender" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                  <option value="">----</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm/6 font-medium text-gray-900">Địa chỉ</label>
            <div class="mt-1">
              <input v-model="address" type="text" name="address" id="address" autocomplete="address" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <button 
            type="submit" 
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="handleRegister"
            >Đăng ký</button>
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const username = ref('');
  const dateOfBirth = ref('');
  const phone = ref('');
  const gender = ref('');
  const address = ref('');

  function checkValidateRegister(event) {
    event.preventDefault();
  }

  async function handleRegister() {
    try {
      const data = {
        name: username.value,
        email: email.value,
        password: password.value,
        role: 'customer',
        dateOfBirth: dateOfBirth.value,
        phone: phone.value,
        gender: gender.value,
        address: address.value
      };

      const response = await axios.post('users/register', data);
      if (response.status === 201) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Register faild: ', error)
    }
  }
</script>