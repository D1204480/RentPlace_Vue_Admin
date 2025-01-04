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

        <!-- 將可用時間的 input 改為時段選擇 -->
        <div class="form-group full-width">
          <label class="form-label">可用時間</label>
          <div class="time-slots-grid">
            <div v-for="(value, key) in timeSlots" :key="key" class="time-slot-item">
              <label class="time-slot-label">
                <input type="checkbox" :value="value" v-model="formData.availableTime" class="time-slot-checkbox">
                <span class="time-slot-text">{{ key }}</span>
              </label>
            </div>
            <!-- 整天選項 -->
            <div class="time-slot-item">
              <label class="time-slot-label">
                <input type="checkbox" value="16" v-model="formData.availableTime" @change="handleAllDayChange"
                  class="time-slot-checkbox">
                <span class="time-slot-text">整天 (07:00-22:00)</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="phoneNumber">電話號碼</label>
          <input type="tel" id="phoneNumber" class="form-input" v-model="formData.phoneNumber" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="imageName">圖片上傳</label>
          <input type="file" id="imageName" class="form-input" @change="handleImageUpload" accept="image/*">
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
          {{ isEdit ? '更新' : '創建' }}
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
const timeSlots = {
  "07:00-08:00": 1,
  "08:00-09:00": 2,
  "09:00-10:00": 3,
  "10:00-11:00": 4,
  "11:00-12:00": 5,
  "12:00-13:00": 6,
  "13:00-14:00": 7,
  "14:00-15:00": 8,
  "15:00-16:00": 9,
  "16:00-17:00": 10,
  "17:00-18:00": 11,
  "18:00-19:00": 12,
  "19:00-20:00": 13,
  "20:00-21:00": 14,
  "21:00-22:00": 15
}

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
  placeName: '',
  venueType: '',
  venueName: '',
  regionName: '',
  address: '',
  unitPrice: null,
  unit: '時',
  capacity: null,
  availableTime: '',  // 將從時段選擇轉換為字串
  remark: null,
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

// 轉換時段選擇為 API 格式
const convertTimeSlots = (selectedSlots) => {
  if (selectedSlots.includes('16')) {
    return '07:00-22:00'
  }

  const slotTimes = selectedSlots.map(slot => {
    const time = Object.entries(timeSlots).find(([_, value]) => value.toString() === slot)
    return time ? time[0] : null
  }).filter(Boolean)

  if (slotTimes.length > 0) {
    const sortedSlots = slotTimes.sort()
    return `${sortedSlots[0].split('-')[0]}-${sortedSlots[sortedSlots.length - 1].split('-')[1]}`
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

// 如果是編輯模式，獲取場地數據
const fetchVenueData = async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const response = await axios.get(`http://localhost:8080/api/venues/${id}`)
      const venueData = response.data
      
      // 更新表單數據
      Object.keys(formData).forEach(key => {
        if (venueData[key] !== undefined) {
          formData[key] = venueData[key]
        }
      })
    } catch (error) {
      console.error('獲取場地數據失敗:', error)
    }
  }
}

// 處理表單提交
const handleSubmit = async () => {
  try {
    const apiData = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      capacity: parseInt(formData.capacity),
      availableTime: convertTimeSlots(formData.availableTime)
    }

    if (isEdit.value) {
      await axios.put(`http://localhost:8080/api/venues/${route.params.id}`, apiData)
    } else {
      await axios.post('http://localhost:8080/api/venues', apiData)
    }
    router.push('/venues')
  } catch (error) {
    console.error('保存失敗:', error)
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
</style>