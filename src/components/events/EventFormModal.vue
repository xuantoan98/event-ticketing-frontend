<template>
  <el-dialog
    :title="isEdit ? 'Cập nhật sự kiện' : 'Thêm sự kiện'"
    width="60%"
    :model-value="visible"
    @update:modelValue="(val) => { emit('update:visible', val) }"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" label-position="top">
      <div>
        <h3 class="text-md">Thông tin bắt buộc</h3>
        <span class="text-xs italic">Nhập thông tin bên dưới để tạo sự kiện</span>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-center w-full mb-[18px] rounded-sm border border-dashed py-4 mt-4">
          <div 
            class="flex items-center justify-center w-full h-full cursor-pointer group"
            @click="triggerFileSelect"
            >
            <div class="flex flex-col items-center justify-center gap-4">
              <el-icon size="large"><Plus /></el-icon>
              <p>
                Ảnh sự kiện
              </p>
            </div>
          </div>

          <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="avatar" class="w-[80px] h-[80px] rounded-full object-cover" />
          <p v-else class="text-gray-500 text-sm">Ảnh xem trước</p>

          <input
            type="file"
            accept="image/png, image/jpeg"
            ref="fileInput"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <el-form-item label="Tiêu đề" prop="title">
            <el-input v-model="form.title" placeholder="Tiêu đề sự kiện" />
          </el-form-item>

          <el-form-item label="Danh mục" prop="eventCategoriesId">
            <el-select 
              v-model="form.eventCategoriesId" 
              placeholder="Danh mục" 
              :key="form.eventCategoriesId" 
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in eventCategoriesOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="">
           <el-form-item label="Mô tả" prop="description">
            <el-mention type="textarea" v-model="form.description" placeholder="Mô tả" />
          </el-form-item>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="Thời gian bắt đầu" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="datetime"
              placeholder="Thời gian bắt đầu"
              format="HH:mm:ss YYYY-MM-DD"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>
          <el-form-item label="Thời gian kết thúc" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="datetime"
              placeholder="Thời gian kết thúc"
              format="HH:mm:ss YYYY-MM-DD"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>
        </div>
      </div>
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Cơ quan" prop="organization">
          <el-input v-model="form.organization" placeholder="Cơ quan" />
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <el-select v-model="form.status" placeholder="Trạng thái" :key="form.status">
            <el-option label="Hoạt động" :value="1" />
            <el-option label="Ngưng hoạt động" :value="0" />
          </el-select>
        </el-form-item>
      </div> -->
      <!-- <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item> -->
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">Hủy</el-button>
      <el-button type="primary" @click="submitForm">
        {{ isEdit ? 'Cập nhật' : 'Lưu' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { Plus } from '@element-plus/icons-vue';
  import { onMounted, reactive, ref } from 'vue';
  import { useEventCategoriesStore } from '../../stores/eventCategories';

  const emit = defineEmits(['update:visible', 'refresh']);
  const eventCategoriesStore = useEventCategoriesStore();

   // định nghĩa props visible: ẩn hiện modal, inviteData cho việc phân biệt modal add và update
  const props = defineProps({
    visible: Boolean,
    eventData: Object
  });

  const isEdit = ref(false);
  const formRef = ref();
  const fileInput = ref(null);
  const avatarFile = ref(null);
  const avatarPreviewUrl = ref(null);
  const eventCategoriesOptions = ref([]);
  const form = reactive({
    coverImage: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isLimitSeat: '',
    eventCategoriesId: ''
  });

  const rules = {
    title: [{ required: true, message: 'Tiêu đề là bắt buộc', trigger: 'blur' }],
    startDate: [{ required: true, message: 'Thời gian bắt đầu là bắt buộc', trigger: 'blur' }],
    endDate: [{ required: true, message: 'Thời gian kết thúc là bắt buộc', trigger: 'blur' }],
    eventCategoriesId: [{ required: true, message: 'Danh mục sự kiện là bắt buộc', trigger: 'blur' }],
    description: [{ required: true, message: 'Mô tả là bắt buộc', trigger: 'blur'}]
  };

  async function submitForm() {

  }

  function handleClose() {
    resetForm();
    emit('update:visible', false);
  }

  function resetForm() {

  }

  // kích hoạt input file để chọn ảnh
  function triggerFileSelect() {
    fileInput.value?.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    avatarFile.value = file
    avatarPreviewUrl.value = URL.createObjectURL(file);
  }

  onMounted(async () => {
    const resultEventCategories = await eventCategoriesStore.fetchEventCategories();
    eventCategoriesOptions.value = resultEventCategories.map((d) => {
      return {
        id: d._id,
        name: d.name
      }
    });
  });
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__wrapper {
    width: 100%;
  }
</style>