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
        <el-button type="primary" @click="handleIsEdit">
          {{ isEdit ? 'Lưu thay đổi' : 'Cập nhật thông tin' }}
        </el-button>
      </div>

      <el-form class="grid gap-6" @submit.prevent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Tên người dùng</label>
            <el-input v-model="name" type="text" placeholder="Tên người dùng" :disabled="!isEdit" />
          </div>
          <div>
            <label class="block text-sm/6 font-medium text-gray-900">Email</label>
            <el-input v-model="email" type="text" placeholder="Email" :disabled="!isEdit" />
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
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm/6 font-medium text-gray-900">Chức vụ</label>
            <div class="mt-1">
              <el-input v-model="userRole" type="text" name="phone" id="phone" autocomplete="phone" placeholder="Số điện thoại" disabled />
            </div>
          </div>
        </div>

        <div class="w-full">
          <label for="address" class="block text-sm/6 font-medium text-gray-900">Địa chỉ</label>
          <div class="mt-1">
            <el-input v-model="address" type="text" name="address" id="address" placeholder="Địa chỉ" autocomplete="address" :disabled="!isEdit" />
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
  import { useField } from 'vee-validate';

  const auth = useAuthStore();
  const genderOptionsStore = useGenderOptionsStore();

  const genderOptions = genderOptionsStore.genderOptions;
  const { value: email } = useField('email');
  const { value: name } = useField('name');
  const { value: phone } = useField('phone');
  const { value: dateOfBirth } = useField('dateOfBirth');
  const { value: gender } = useField('gender');
  const { value: address } = useField('address');

  const isEdit = ref(false);
  
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

  const handleIsEdit = async () => {
    if (isEdit.value) {
      // Call api update user

      console.log('call api update user');
    }

    isEdit.value = !isEdit.value;
  }
</script>