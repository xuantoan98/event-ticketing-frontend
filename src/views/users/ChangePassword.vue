<template>
  <div>
    <div class="flex items-center justify-between">
      <h2>Đổi mật khẩu tài khoản</h2>
    </div>

    <div class="w-[500px] mt-4">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
        <el-form-item label="Mật khẩu hiện tại" prop="currentPassword">
          <el-input type="password" v-model="form.currentPassword" show-password />
        </el-form-item>

        <el-form-item label="Mật khẩu mới" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" show-password />
        </el-form-item>

        <el-form-item label="Nhập lại mật khẩu mới" prop="repeatPassword">
          <el-input type="password" v-model="form.repeatPassword" show-password />
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="submitForm">
        Cập nhật
      </el-button>
      <el-button type="warning" @click="resetForm">
        Làm mới
      </el-button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { useUserStore } from '../../stores/user';
  import { ElMessage } from 'element-plus';
  import { useAuthStore } from '../../stores/auth';
  import { useRouter } from 'vue-router';

  const auth = useAuthStore();
  const router = useRouter();
  const userStore = useUserStore();
  const formRef = ref();
  const form = reactive({
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

  const validateRepeatPassword = (rule, value, callback) => {
    if (!value) {
      callback(new Error('Nhập lại mật khẩu là bắt buộc'));
    } else if (value !== form.newPassword) {
      callback(new Error('Mật khẩu mới không khớp'));
    } else {
      callback();
    }
  }

  const rules = {
    currentPassword: [{ required: true, message: 'Mật khẩu hiện tại là bắt buộc', trigger: 'blur' }],
    newPassword: [{ required: true, message: 'Mật khẩu mới là bắt buộc', trigger: 'blur' }],
    repeatPassword: [
      { required: true, message: 'Nhập lại mật khẩu là bắt buộc', trigger: 'blur' },
      { validator: validateRepeatPassword, trigger: 'blur' }
    ]
  };

  function submitForm() {
    formRef.value.validate(async (valid) => {
      if (!valid) {
        return;
      }

      try {
        const result = await userStore.changePassword(form.currentPassword, form.newPassword);        
        ElMessage.success(result.data.message || 'Cập nhật mật khẩu thành công');

        auth.logout();
        router.push('/login');
      } catch (error) {
        ElMessage.error(error.response.data.message || 'Cập nhật mật khẩu thất bại');
      }
    });
  }

  function resetForm() {
    Object.assign(form, {
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    });
  }
</script>