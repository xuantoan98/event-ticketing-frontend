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
        <div class="px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-center w-full rounded-sm border border-dashed py-4 mt-4">
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

            <img v-if="coverImagePreviewUrl" :src="coverImagePreviewUrl" alt="avatar" class="w-[80px] h-[80px] rounded-full object-cover" />
            <p v-else class="text-gray-500 text-sm">Ảnh xem trước</p>

            <input
              type="file"
              accept="image/png, image/jpeg"
              ref="fileInput"
              class="hidden"
              @change="handleAvatarChange"
            />
          </div>
        </div>

        <div class="px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <el-form-item label="Tiêu đề" prop="title">
            <el-input v-model="form.title" placeholder="Tiêu đề sự kiện" />
          </el-form-item>

          <el-form-item label="Danh mục" prop="eventCategoriesId">
            <el-select 
              v-model="form.eventCategory" 
              placeholder="Danh mục" 
              :key="form.eventCategory" 
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

        <div class="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div class="px-4">
           <el-form-item label="Mô tả" prop="description">
            <el-mention type="textarea" v-model="form.description" placeholder="Mô tả" />
          </el-form-item>
        </div>
      </div>
      
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>

      <div>
        <h3 class="text-md">Thông tin chi tiết</h3>
        <span class="text-xs italic">Thông tin bổ sung cho sự kiện</span>

        <div class="px-4">
          <el-form-item label="Địa chỉ" prop="location">
            <el-mention type="textarea" v-model="form.location" placeholder="Nhập địa chỉ rõ ràng..." />
          </el-form-item>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="Chi phí dự kiến" prop="estimatePrice">
              <el-input
                v-model="form.estimatePrice"
                style="width: 100%"
                placeholder="Nhập số tiền"
                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')"
                :parser="(value) => value.replace(/[\sVNĐ.]*/g, '')"
              >
                <template #append>VND</template>
              </el-input>
              <!-- <el-input-number v-model="form.estimatePrice" controls-position="right" placeholder="0"  /> -->
            </el-form-item>

            <el-form-item label="Chỗ ngồi" prop="isLimitSeat">
              <el-radio-group v-model="form.isLimitSeat" @change="handleDisplayEnterLimitSeats">
                <el-radio :value="0" border>Không giới hạn</el-radio>
                <el-radio :value="1" border>Giới hạn</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="">
            <el-form-item 
              label="Số lượng chỗ ngồi" 
              prop="totalSeats"
              v-show="isLimitSeats"
              >
              <el-input-number v-model="form.totalSeats" controls-position="right" placeholder="1" />
            </el-form-item>
          </div>

          <div class="el-form-item flex-col">
            <div class="flex items-center justify-start mb-2">
              <label class="el-form-item__label">Người hỗ trợ</label>
              <el-button type="primary" size="small" plain v-show="!showAddSupporters" @click="handleDisplayAddSupporters">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>

            <div class="flex items-center justify-between w-full gap-4">
              <el-select 
                v-model="form.supports.userId"
                v-show="showAddSupporters"
                placeholder="Người hỗ trợ" 
                :key="form.supports.userId" 
                filterable
                multiple
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button :icon="Close" circle v-show="showAddSupporters" @click="handleDisplayAddSupporters(false)" />
            </div>
          </div>

          <div class="el-form-item flex-col">
            <div class="flex items-center justify-start mb-2">
              <label class="el-form-item__label">Khách mời</label>
              <el-button type="primary" size="small" plain v-show="!showAddInvites" @click="handleDisplayAddInvites"><el-icon><Plus /></el-icon></el-button>
            </div>
            <div class="flex items-center justify-between w-full gap-4">
              <el-select 
                v-model="form.invites"
                v-show="showAddInvites"
                placeholder="Khách mời" 
                :key="form.invites" 
                filterable
                multiple
              >
                <el-option
                  v-for="item in inviteOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button :icon="Close" circle v-show="showAddInvites" @click="handleDisplayAddInvites(false)" />
            </div>
          </div>

          <!-- <div class="flex items-center justify-start mb-2">
            <label class="el-form-item__label">Chi phí</label>
            <el-button type="primary" size="small" plain @click="addExpense"><el-icon><Plus /></el-icon></el-button>
          </div>

          <div v-for="(cost, index) in form.costs" :key="index" class="box-expense mb-4 p-4 border rounded-md bg-gray-50">
            <el-row :gutter="20">
              <el-col :span="9">
                <el-form-item label="Tên chi phí">
                  <el-input v-model="cost.name" placeholder="Nhập tên chi phí" />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="Giá">
                  <el-input v-model="cost.price" :min="0" controls-position="right" placeholder="0">
                    <template #append>VND</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="Số lượng">
                  <el-input-number v-model="cost.quantity" :min="1" />
                </el-form-item>
              </el-col>

              <el-col :span="3">
                <el-form-item label="Loại">
                  <el-select v-model="cost.type" placeholder="Chọn loại">
                    <el-option label="Thu" value="income" />
                    <el-option label="Chi" value="expense" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="2" style="text-align: right;">
                <el-button size="small" type="danger" circle @click="removeExpense(index)">
                  <el-icon><Remove /></el-icon>
                </el-button>
              </el-col>

              <el-col :span="24">
                <el-form-item label="Ghi chú">
                  <el-input type="textarea" v-model="cost.note" rows="2" placeholder="Ghi chú thêm (nếu có)" />
                </el-form-item>
              </el-col>
            </el-row>
          </div> -->
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">Hủy</el-button>
      <el-button :loading="loading" type="primary" @click="submitForm">
        {{ isEdit ? 'Cập nhật' : 'Lưu' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { Close, Delete, Plus, Remove } from '@element-plus/icons-vue';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useEventCategoriesStore } from '../../stores/eventCategories';
  import { useUserStore } from '../../stores/user';
  import { useInviteStore } from '../../stores/invite';
  import { useEventStore } from '../../stores/event';
  import axios from '../../utils/axios';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['update:visible', 'refresh']);
  const eventCategoriesStore = useEventCategoriesStore();
  const userStore = useUserStore();
  const inviteStore = useInviteStore();
  const eventStore = useEventStore();

  // định nghĩa props visible: ẩn hiện modal, inviteData cho việc phân biệt modal add và update
  const props = defineProps({
    visible: Boolean,
    eventData: Object
  });

  const eventCategoriesOptions = ref([]);
  const userOptions = ref([]);
  const inviteOptions = ref([]);

  const isEdit = ref(false);
  const loading = ref(false);
  const formRef = ref();
  const fileInput = ref(null);
  const coverImageFile = ref(null);
  const coverImagePreviewUrl = ref(null);
  const isLimitSeats = ref(false);
  const showAddSupporters = ref(false);
  const showAddInvites = ref(false);
  const form = reactive({
    coverImage: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    eventCategoriesId: [],
    estimatePrice: 0,
    isLimitSeat: 0,
    totalSeats: 0,
    supporters: [],
    invites: [],
    costs: [],
    supports: {},
    eventCategory: []
  });

  const rules = {
    title: [{ required: true, message: 'Tiêu đề là bắt buộc', trigger: 'blur' }],
    startDate: [{ required: true, message: 'Thời gian bắt đầu là bắt buộc', trigger: 'blur' }],
    endDate: [{ required: true, message: 'Thời gian kết thúc là bắt buộc', trigger: 'blur' }],
    eventCategory: [{ required: true, message: 'Danh mục sự kiện là bắt buộc', trigger: 'blur' }],
    description: [{ required: true, message: 'Mô tả là bắt buộc', trigger: 'blur'}],
    // estimatePrice: [{ type: 'number', message: 'Chi phí dự kiến phải là số' },]
  };

  async function submitForm() {
    loading.value = true;

    formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {
        let coverImagePath = form.coverImage;

        if (coverImageFile.value) {
          const formData = new FormData();
          formData.append('avatar', coverImageFile.value);

          const res = await axios.post('/upload-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (res.status === 200) {
            coverImagePath = res.data.data.path;
          } else {
            ElMessage.error('Tải ảnh thất bại');
            return;
          }
        }

        const payload = {
          ...form,
          coverImage: coverImagePath,
        }

        if (isEdit.value && props.eventData?._id) {
          // nếu là update thì cần modify lại dữ liệu danh mục, người hỗ trợ và khách mời  
          if (form.eventCategoriesId.length > 0) {
            const eventCategoriesUpdate = form.eventCategoriesId.map(e => e._id ? e._id : e);
            payload.eventCategoriesId = eventCategoriesUpdate;
          }
          
          // ngời hỗ trợ
          if (form.supporters.length > 0) {
            const eventSupports = form.supporters.map(e => e._id ? e._id : e);
            payload.supporters = eventSupports;
          }
          
          // khách mời
          if (form.invites.length > 0) {
            const eventInvites = form.invites.map(e => e._id ? e._id : e);
            payload.invites = eventInvites;
          }

          await eventStore.updateEvent(props.eventData?._id, payload);
          ElMessage.success('Cập nhật thành công');
        } else {          
          await eventStore.addEvent(payload);
          ElMessage.success('Thêm mới thành công');
        }

        loading.value = false;
        emit('refresh');
        handleClose();
      } catch (error) {
        console.error(error);
      }
    })
  }

  function handleClose() {
    resetForm();
    emit('update:visible', false);
  }

  function resetForm() {
    isEdit.value = false;
    formRef.value?.resetFields();
    coverImagePreviewUrl.value = null;
    Object.assign(form, {
      coverImage: '',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      eventCategoriesId: [],
      estimatePrice: 0,
      isLimitSeat: 0,
      totalSeats: 0,
      supporters: [],
      invites: [],
      costs: [],
      supports: {}
    });
  }

  // kích hoạt input file để chọn ảnh
  function triggerFileSelect() {
    fileInput.value?.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    coverImageFile.value = file
    coverImagePreviewUrl.value = URL.createObjectURL(file);
  }

  function handleDisplayEnterLimitSeats(value) {
    value === 0 ? isLimitSeats.value = false : isLimitSeats.value = true;
  }

  function handleDisplayAddSupporters(value = true) {
    showAddSupporters.value = value;
  }

  function handleDisplayAddInvites(value = true) {
    showAddInvites.value = value;
  }

  function addExpense() {
    form.costs.push({
      name: '',
      price: 0,
      quantity: 1,
      type: 'expense', // hoặc 'income'
      note: ''
    });
  };

  function removeExpense(index) {
    form.costs.splice(index, 1);
  };

  watch(
    () => props.visible,
    (val) => {
      if (val && props.eventData) {
        isEdit.value = true;
        Object.assign(form, props.eventData);

        coverImageFile.value = null; // reset file
        coverImagePreviewUrl.value = props.eventData.coverImage || null;
        if (props.eventData.supports.userInfo.length > 0) {
          showAddSupporters.value = true;
        }
      } else {
        isEdit.value = false;
        resetForm();
      }
    }
  );

  onMounted(async () => {
    // Lấy ds danh mục sự kiện
    const resultEventCategories = await eventCategoriesStore.fetchEventCategories();
    eventCategoriesOptions.value = resultEventCategories.map((d) => {
      return {
        id: d._id,
        name: d.name
      }
    });

    // lấy ds nhân viên trong hệ thống
    const resultUsers = await userStore.fetchUsers();
    userOptions.value = resultUsers.map((u) => {
      return {
        id: u._id,
        name: u.name
      }
    });

    // lấy ds khách mời trong hệ thống
    const resultInvites = await inviteStore.fetchAllInvites();
    inviteOptions.value = resultInvites.map((u) => {
      return {
        id: u._id,
        name: u.name
      }
    });
  });
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__wrapper {
    width: 100%;
  }

  .el-form-item__content .el-input-number {
    width: 100%;
  }

  .el-form-item__content .el-input__inner {
    text-align: left;
  }

  .box-expense {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background-color: #fafafa;
  }

  .el-form-item__content .el-textarea__inner {
    height: 100px;
  }
</style>