<template>
  <div class="login-page bg-[#ededed] h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto">
      <div class="">
        <img class="mx-auto h-10 w-auto" src="../assets/logo-cs.png" alt="MasterX" />
        <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Quên mật khẩu</h2>
      </div>

      <div class="mt-6">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
          <div>
            <el-form-item label="Vui lòng nhập email của bạn" prop="email">
              <el-input v-model="form.email" placeholder="Email" />
            </el-form-item>
          </div>

          <div class="">
            <el-button :loading="loading" style="width: 100%;" type="primary" @click="handleSubmit">
              Gửi
            </el-button>
          </div>

          <div class="mt-4">
            <el-text class="" type="danger" size="small">Lưu ý: Mật khẩu mới sẽ được gửi tới email của bạn, hãy kiểm tra.</el-text>
          </div>
          
          <div class="text-sm mt-4">
            <router-link to="/login" class="text-gray-900 hover:opacity-[0.8] flex items-center">
              <el-icon class="mr-1"><Back /></el-icon>
              Quay lại đăng nhập
            </router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import { publicApi } from '../utils/axios';
  import { ElMessage } from 'element-plus';
  import { reactive, ref } from 'vue';

  const router = useRouter();
  const formRef = ref();
  const form = reactive({
    email: ''
  });
  const loading = ref(false);

  const rules = {
    email: [
      { required: true, message: 'Email là bắt buộc', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
  };

  async function handleSubmit() {
    loading.value = true;

    formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {
        const response = await publicApi.post('/auth/forgot-password', {...form});
        if (response.status === 200) {
          ElMessage({
            message: response.data.message || 'Xảy ra lỗi',
            type: 'success',
            grouping: true
          });

          router.push('/login');
        }

        loading.value = false;
      } catch (error) {
        ElMessage({
          message: error.response.data.message || 'Xảy ra lỗi',
          type: 'error',
          grouping: true
        });

        loading.value = false;
      }
    });
  }
</script>
