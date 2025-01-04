<!-- VenueForm.vue -->
<template>
  <div class="container-fluid mt-4">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">{{ isEdit ? '編輯場地' : '新增場地' }}</h1>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="placeName">場地名稱</label>
          <input type="text" id="placeName" class="form-input" v-model="formData.placeName" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="venueType">場地類型</label>
          <select id="venueType" class="form-select" v-model="formData.venueType" required>
            <option value="">請選擇場地類型</option>
            <option v-for="type in venueTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="venueName">場館名稱</label>
          <input type="text" id="venueName" class="form-input" v-model="formData.venueName" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="regionName">行政區</label>
          <select id="regionName" class="form-select" v-model="formData.regionName" required>
            <option value="">請選擇行政區</option>
            <option v-for="region in regions" :key="region.value" :value="region.label">
              {{ region.label }}
            </option>
          </select>
        </div>

        <div class="form-group full-width">
          <label class="form-label" for="address">地址</label>
          <input type="text" id="address" class="form-input" v-model="formData.address" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="unitPrice">單價</label>
          <input type="number" id="unitPrice" class="form-input" v-model="formData.unitPrice" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="unit">計價單位</label>
          <select id="unit" class="form-select" v-model="formData.unit" required>
            <option v-for="unit in unitTypes" :key="unit.value" :value="unit.value">
              {{ unit.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="capacity">容納人數</label>
          <input type="number" id="capacity" class="form-input" v-model="formData.capacity" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="availableTime">營業時間</label>
          <input type="text" id="availableTime" class="form-input" v-model="formData.availableTime" required>
        </div>

         <!-- 時段選擇部分
        <div class="form-group full-width">
          <label class="form-label">可預約時段</label>
          <div class="time-slots-grid">
             個別時段
            <div v-for="(value, key) in timeSlots" :key="key" class="time-slot-item">
              <label class="time-slot-label">
                <input type="checkbox" :value="value.toString()" v-model="formData.availableTime"
                  class="time-slot-checkbox">
                <span class="time-slot-text">{{ key }}</span>
              </label>
            </div>
             整天選項 
            <div class="time-slot-item">
              <label class="time-slot-label">
                <input type="checkbox" value="16" v-model="formData.availableTime" @change="handleAllDayChange"
                  class="time-slot-checkbox">
                <span class="time-slot-text">整天 (07:00-22:00)</span>
              </label>
            </div>
          </div>
        </div>  -->

        <div class="form-group">
          <label class="form-label" for="phoneNumber">電話號碼</label>
          <input type="tel" id="phoneNumber" class="form-input" v-model="formData.phoneNumber" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="imageName">圖片上傳</label>
          <input type="file" id="imageName" class="form-input" @change="handleImageUpload" accept="image/*">
          <!-- 預覽圖片 -->
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="預覽" class="preview-img">
          </div>
        </div>

        <!-- 設備清單 -->
        <div class="form-group full-width">
          <label class="form-label">設備</label>
          <div class="equipment-grid">
            <label v-for="item in equipmentOptions" :key="item" class="equipment-item">
              <input type="checkbox" :value="item" v-model="formData.equipment">
              <span>{{ item }}</span>
            </label>
          </div>
        </div>

        <!-- 關閉日期 -->
        <div class="form-group full-width">
          <label class="form-label">休館日期</label>
          <input type="date" v-model="newCloseDate" class="form-input mb-2">
          <button type="button" @click="addCloseDate" class="btn btn-outline mb-2">
            新增日期
          </button>
          <div class="close-dates-list">
            <div v-for="(date, index) in formData.closeDates" :key="index" class="close-date-item">
              {{ date }}
              <button type="button" @click="removeCloseDate(index)" class="btn-remove">
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="remark">備註</label>
        <textarea id="remark" class="form-textarea" v-model="formData.remark"></textarea>
      </div>

      <div class="button-group">
        <router-link to="/venues" class="btn btn-outline">
          返回
        </router-link>
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? '更新' : '新增' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const newCloseDate = ref('')  // 休館日

// 定義場地類型選項
const venueTypes = [
  { value: 'meeting', label: '會議室' },
  { value: 'classroom', label: '教室' },
  { value: 'hall', label: '禮堂' },
  { value: 'sports', label: '運動場地' }
]

// 定義行政區選項
const regions = [
  // 北部地區
  { value: 'taipei', label: '臺北市' },
  { value: 'newtaipei', label: '新北市' },
  { value: 'keelung', label: '基隆市' },
  { value: 'taoyuan', label: '桃園市' },
  { value: 'hsinchu_city', label: '新竹市' },
  { value: 'hsinchu_county', label: '新竹縣' },
  { value: 'yilan', label: '宜蘭縣' },
  // 中部地區
  { value: 'miaoli', label: '苗栗縣' },
  { value: 'taichung', label: '臺中市' },
  { value: 'changhua', label: '彰化縣' },
  { value: 'nantou', label: '南投縣' },
  { value: 'yunlin', label: '雲林縣' },
  // 南部地區
  { value: 'chiayi_city', label: '嘉義市' },
  { value: 'chiayi_county', label: '嘉義縣' },
  { value: 'tainan', label: '臺南市' },
  { value: 'kaohsiung', label: '高雄市' },
  { value: 'pingtung', label: '屏東縣' },
  // 東部地區
  { value: 'hualien', label: '花蓮縣' },
  { value: 'taitung', label: '臺東縣' },
  // 離島地區
  { value: 'penghu', label: '澎湖縣' },
  { value: 'kinmen', label: '金門縣' },
  { value: 'lienchiang', label: '連江縣' }
]

// 定義計價單位選項
const unitTypes = [
  { value: '時', label: '小時' },
  { value: '次', label: '每次' }
]

// 定義時段選項
// const timeSlots = {
//   "07:00-08:00": 1,
//   "08:00-09:00": 2,
//   "09:00-10:00": 3,
//   "10:00-11:00": 4,
//   "11:00-12:00": 5,
//   "12:00-13:00": 6,
//   "13:00-14:00": 7,
//   "14:00-15:00": 8,
//   "15:00-16:00": 9,
//   "16:00-17:00": 10,
//   "17:00-18:00": 11,
//   "18:00-19:00": 12,
//   "19:00-20:00": 13,
//   "20:00-21:00": 14,
//   "21:00-22:00": 15
// }

// 設備選項
const equipmentOptions = [
  '麥克風',
  '飲水機',
  '投影機',
  '白板',
  '音響',
  '椅子',
  '桌子'
]

const formData = reactive({
  id: null,           // 添加 id 欄位
  placeName: '',
  venueType: '',
  venueName: '',
  regionName: '',
  address: '',
  unitPrice: null,
  unit: '時',
  capacity: null,
  availableTime: '',
  remark: null,
  imageId: null,      // 添加 imageId 欄位
  imageName: '',
  phoneNumber: '',
  equipment: [],
  closeDates: []
})

// 處理關閉日期的添加
const addCloseDate = () => {
  if (newCloseDate.value && !formData.closeDates.includes(newCloseDate.value)) {
    formData.closeDates.push(newCloseDate.value)
    newCloseDate.value = ''  // 清空輸入
  }
}

// 處理關閉日期的移除
const removeCloseDate = (index) => {
  formData.closeDates.splice(index, 1)
}

// 時段處理函數
const convertTimeSlots = (selectedSlots) => {
  if (!Array.isArray(selectedSlots)) {
    return ''
  }

  // 如果選擇整天
  if (selectedSlots.includes('16')) {
    return '07:00-22:00'
  }

  // 轉換選中的時段編號為時間字串
  const selectedTimes = selectedSlots
    .map(Number)
    .sort((a, b) => a - b)
    .map(slot => {
      const timeEntry = Object.entries(timeSlots).find(([_, value]) => value === slot)
      return timeEntry ? timeEntry[0] : null
    })
    .filter(Boolean)

  if (selectedTimes.length > 0) {
    // 取第一個時段的開始時間和最後一個時段的結束時間
    const startTime = selectedTimes[0].split('-')[0]
    const endTime = selectedTimes[selectedTimes.length - 1].split('-')[1]
    return `${startTime}-${endTime}`
  }

  return ''
}

// 處理整天選項的變更
const handleAllDayChange = (event) => {
  if (event.target.checked) {
    // 選擇整天時，清空其他選項
    formData.availableTime = ['16']
  } else {
    // 取消整天時，清空所有選項
    formData.availableTime = []
  }
}

// 監聽個別時段的變更
watch(() => formData.availableTime, (newValue) => {
  // 如果選擇了個別時段，且包含整天選項，則移除整天選項
  if (newValue.includes('16') && newValue.length > 1) {
    formData.availableTime = newValue.filter(v => v !== '16')
  }
}, { deep: true })

const imagePreview = ref(null)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.imageName = file.name

    // 創建預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 如果是編輯模式，獲取場地數據
const fetchVenueData = async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const response = await axios.get(`http://localhost:8080/api/venues/${id}`)
      const venueData = response.data
      
      // 更新表單數據，包括 id
      formData.id = venueData.id
      formData.placeName = venueData.placeName
      formData.venueType = venueData.venueType
      formData.venueName = venueData.venueName
      formData.regionName = venueData.regionName
      formData.address = venueData.address
      formData.unitPrice = venueData.unitPrice
      formData.unit = venueData.unit
      formData.capacity = venueData.capacity
      formData.availableTime = venueData.availableTime
      formData.remark = venueData.remark
      formData.imageId = venueData.imageId
      formData.imageName = venueData.imageName
      formData.phoneNumber = venueData.phoneNumber
      formData.equipment = venueData.equipment || []
      formData.closeDates = venueData.closeDates || []
    } catch (error) {
      console.error('獲取場地數據失敗:', error)
    }
  }
}

// 處理表單提交
const handleSubmit = async () => {
  try {
    // 在送出前先打印看看數據內容
    console.log('原始表單數據:', formData)

    const apiData = {
      id: parseInt(formData.id),          // 確保是數字
      placeName: String(formData.placeName),    // 確保是字串
      venueType: String(formData.venueType),    // 確保是字串
      venueName: String(formData.venueName),    // 確保是字串
      regionName: String(formData.regionName),  // 確保是字串
      address: String(formData.address),        // 確保是字串
      unitPrice: parseFloat(formData.unitPrice), // 確保是數字
      unit: String(formData.unit),              // 確保是字串
      capacity: parseInt(formData.capacity),     // 確保是數字
      availableTime: String(formData.availableTime), // 確保是字串
      remark: formData.remark ? String(formData.remark) : null,
      imageId: formData.imageId ? parseInt(formData.imageId) : null,  // 確保是數字或 null
      imageName: String(formData.imageName),    // 確保是字串
      phoneNumber: String(formData.phoneNumber), // 確保是字串
      equipment: Array.isArray(formData.equipment) ? formData.equipment : [], // 確保是陣列
      closeDates: Array.isArray(formData.closeDates) ? formData.closeDates : [] // 確保是陣列
    }

    console.log('準備送出的數據:', apiData)

    if (isEdit.value) {
      const response = await axios.put(`http://localhost:8080/api/venues/${route.params.id}`, apiData)
      console.log('PUT 響應:', response.data)
    } else {
      const response = await axios.post('http://localhost:8080/api/venues', apiData)
      console.log('POST 響應:', response.data)
    }
    router.push('/venues')
  } catch (error) {
    console.error('保存失敗:', error)
    if (error.response) {
      console.error('錯誤狀態:', error.response.status)
      console.error('錯誤詳情:', error.response.data)
      console.error('錯誤標頭:', error.response.headers)
    } else if (error.request) {
      console.error('請求錯誤:', error.request)
    } else {
      console.error('錯誤訊息:', error.message)
    }
  }
}

onMounted(() => {
  fetchVenueData()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.card-title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.button-group {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-outline {
  background-color: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
}

.btn-outline:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .button-group {
    grid-column: span 1;
  }
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.time-slot-item {
  padding: 8px;
}

.time-slot-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.time-slot-checkbox {
  margin-right: 8px;
}

.time-slot-text {
  font-size: 14px;
}

/* 當選中時的樣式 */
.time-slot-checkbox:checked+.time-slot-text {
  color: #4a90e2;
  font-weight: 500;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.close-dates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.close-date-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 4px;
}

.btn-remove {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0 4px;
}

.btn-remove:hover {
  color: #c82333;
}

.image-preview {
  margin-top: 10px;
  max-width: 200px;
}

.preview-img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>