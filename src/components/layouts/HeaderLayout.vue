<template>
  <div class="flex justify-between items-center w-full">
    <div class="system-logo w-[150px] flex items-center justify-center">
      <img src="../../assets/logo-cs.png" alt="Logo" class="w-full h-full object-cover">
    </div>

    <!-- <div class="border border-[lightgray] bg-[#EFF0F6] rounded-sm py-2 px-4 flex items-center justify-center"> -->
      <el-dropdown placement="bottom">
        <span class="el-dropdown-link flex items-center justify-center gap-x-2 text-[#191919]">
          <img v-if="auth.user && auth.user.avatar" :src="auth.user.avatar" alt="#" class="block w-[25px] h-[25px] rounded-full object-cover">
          <img v-else src="../../assets/vue.svg" alt="#" class="block w-[25px] h-[25px] rounded-full object-cover">
          {{ auth.user.name }}
          <el-icon class="el-icon--right"><DCaret /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link 
                :to="{ name: 'user-detail', params: { id: auth.user.id } }" 
                class="flex items-center gap-x-3"
                >
                <el-icon class="!m-0" :size="18"><User /></el-icon>
                Manager Account
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="flex items-center gap-x-3">
                <el-icon class="!m-0" :size="18"><Memo /></el-icon>
                My Events
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="flex items-center gap-x-3">
                <el-icon class="!m-0" :size="18"><Setting /></el-icon>
                Change password
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="handleLogout">
              <div class="flex items-center gap-x-3">
                <el-icon class="!m-0" :size="18"><SwitchButton /></el-icon>
                Logout
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    <!-- </div> -->
    
  </div>
</template>

<script setup>
  import { useAuthStore } from '../../stores/auth';
  import { useRouter } from 'vue-router';

  const auth = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    auth.logout();
    router.push('/login');
  }
</script>
