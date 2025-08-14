<template>
  <div class="flex items-center justify-between">
    <h2>Tổng quan chung</h2>
  </div>

  <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 report-layout">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Sự kiện</span>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <el-text class="mx-1" size="large" type="danger">
          {{ eventCount }}
        </el-text>
        <el-icon><Calendar /></el-icon>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>Sự kiện hoàn thành</span>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <el-text class="mx-1" size="large" type="danger">
          {{ eventFinishCount }}
        </el-text>
        <el-icon color="#67c23a"><SuccessFilled /></el-icon>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>Tài khoản</span>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <el-text class="mx-1" size="large" type="danger">
          {{ userCount }}
        </el-text>
        <el-icon color="#409eff"><UserFilled /></el-icon>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>Khách mời</span>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <el-text class="mx-1" size="large" type="danger">
          {{ inviteCount }}
        </el-text>
        <el-icon color=""><Avatar /></el-icon>
      </div>
    </el-card>
  </div>

  <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div class="bg-white rounded-xl shadow overflow-hidden transition-shadow duration-300 col-span-1">
      <h3 class="p-3">Nhân sự hệ thống</h3>
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden transition-shadow duration-300 col-span-2">
      <h3 class="p-3">Sự kiện hệ thống</h3>
      <Bar :data="chartDataBar" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useEventStore } from '../stores/event';
  import { useInviteStore } from '../stores/invite';
  import { useUserStore } from '../stores/user';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
  import { Bar, Pie } from 'vue-chartjs';

  const eventStore = useEventStore();
  const userStore = useUserStore();
  const inviteStore = useInviteStore();

  const eventData = ref([]);
  const eventFinishData = ref([]);
  const userData = ref([]);
  const inviteData = ref([]);
  const loading = ref(true);

  const eventCount = computed(() => eventData.value.length);
  const eventFinishCount = computed(() => {
    return eventData.value.filter(event => event.status === 'closed').length;
  });
  const userCount = computed(() => userData.value.length);
  const inviteCount = computed(() => inviteData.value.length);

  // Đếm số quản trị viên và người dùng
  const adminCount = computed(() => userData.value.filter(u => u.role === 'admin').length);
  const normalUserCount = computed(() => userData.value.filter(u => u.role === 'employee').length);

  const eventsPerMonth = computed(() => {
    const monthCounts = Array(12).fill(0);
    eventData.value.forEach(event => {
      const month = new Date(event.startDate).getMonth(); // 0-11
      monthCounts[month]++;
    });
    return monthCounts;
  });

  // Mục đích đăng ký các component
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

  // Dữ liệu cho biểu đồ
  const chartData = computed(() => ({
    labels: ['Quản trị viên', 'Người dùng'],
    datasets: [
      {
        label: 'Số lượng',
        data: [adminCount.value, normalUserCount.value],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverOffset: 4
      }
    ]
  }));

  const chartDataBar = computed(() => ({
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: 'Số sự kiện',
        data: eventsPerMonth.value,
        backgroundColor: '#36A2EB'
      }
    ]
  }));

  // Options cho Chart.js
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: false,
        text: 'Thống kê nhân sự'
      }
    }
  }

  onMounted(async () => {
    try {
      // lấy số lượng event, user và invite
      const events = await eventStore.fetchEvents(1, 500);
      eventData.value = events || [];

      const users = await userStore.fetchUsers();
      userData.value = users || [];

      const invites = await inviteStore.fetchAllInvites();
      inviteData.value = invites || [];

      eventFinishData.value = eventData.value.filter(event => {
        return event.status === 'closed';
      });

    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
</script>

<style>
  .report-layout .el-icon {
    width: 30px;
    height: 30px;
  }

  .report-layout .el-icon svg {
    width: 100%;
    height: 100%;
  }

  .report-layout .el-text {
    font-size: 30px;
    font-weight: 500;
  }
</style>