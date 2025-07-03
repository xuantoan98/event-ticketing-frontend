<template>
  <div>
    <!-- banner user -->
    <div class="block w-full h-[100px]">
      <img src="../assets/user-banner.jpg" alt="">
    </div>

    <!-- info user -->
    <div class="block w-full">
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
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Edit</button>
      </div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm/6 font-medium text-gray-900">Tên người dùng</label>
          <input type="text" placeholder="Tên người dùng" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
        <div>
          <label class="block text-sm/6 font-medium text-gray-900">Email</label>
          <input type="text" placeholder="Email" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>

        <!-- Row 2 -->
        <div>
          <label class="block text-sm/6 font-medium text-gray-900">Giới tính</label>
          <el-select v-model="gender" placeholder="Giới tính" style="width: 100%; height: 36px;">
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
            type="date"
            placeholder="Ngày sinh"
            style="width: 100%; height: 36px;"
          />
        </div>

        <!-- Row 3 -->
         <div>
          <label for="phone" class="block text-sm/6 font-medium text-gray-900">Số điện thoại <span class="text-sm text-red-500">*</span></label>
          <div class="mt-1">
            <input v-model="phone" type="text" name="phone" id="phone" autocomplete="phone" placeholder="Số điện thoại" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <label for="address" class="block text-sm/6 font-medium text-gray-900">Địa chỉ</label>
          <div class="mt-1">
            <input v-model="address" type="text" name="address" id="address" placeholder="Địa chỉ" autocomplete="address" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { useAuthStore } from '../stores/auth';

  const auth = useAuthStore();
</script>