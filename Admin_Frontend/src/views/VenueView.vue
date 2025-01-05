// VenueList.vue
<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="container-fluid mt-4 mb-3 text-end">
      <router-link to="/venues/create" class="btn btn-primary">
        新增場地
      </router-link>
    </div>

    <!-- 場地列表 -->
    <div class="container-fluid">
      <div class="card mt-3 mb-3 p-2">
        <div class="table-responsive">
          <table class="table">
            <thead style="white-space: nowrap;">
              <tr>
                <th>序號</th>
                <th>場地名稱</th>
                <th>類型</th>
                <th>地區</th>
                <th>容納人數</th>
                <th>單價</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(venue, index) in paginatedVenues" :key="venue.id">
                <td>{{ calculateIndex(index) }}</td>
                <td>{{ venue.placeName }}</td>
                <td>{{ getVenueTypeName(venue.venueType) }}</td>
                <td>{{ venue.regionName }}</td>
                <td>{{ venue.capacity }}</td>
                <td>{{ venue.unitPrice }} / {{ venue.unit }}</td>
                <td>
                  <router-link :to="`/venues/${venue.id}/edit`" class="btn btn-outline-primary btn-sm me-2">
                    編輯
                  </router-link>
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(venue)">
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="d-flex justify-content-center mt-3 mb-4" v-if="totalPages > 1">
      <Pagination 
        :total-pages="totalPages" 
        :current-page="currentPage" 
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Pagination from '../components/Pagination.vue';

const router = useRouter()
const venues = ref([])
const currentPage = ref(1)
const itemsPerPage = 15  // 每頁顯示的數量

// 直接在組件中定義 API 函數
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // 替換為實際的後端地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(venues.value.length / itemsPerPage)
})

// 計算當前頁面要顯示的場地
const paginatedVenues = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return venues.value.slice(start, end)
})

// 計算序號
const calculateIndex = (index) => {
  return (currentPage.value - 1) * itemsPerPage + index + 1
}

// 處理頁碼變更
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo(0, 0)
}

// 獲取場地列表
const fetchVenues = async () => {
  try {
    console.log('開始獲取場地列表')
    const response = await api.get('/venues')
    console.log('API Response:', response)

    if (response.data) {
      venues.value = response.data
    }
  } catch (error) {
    console.error('獲取場地列表失敗:', error)
    if (error.response) {
      console.error('Error details:', {
        status: error.response.status,
        data: error.response.data
      })
    }
  }
}

// 刪除場地
const confirmDelete = async (venue) => {
  if (confirm(`確定要刪除場地 "${venue.placeName}" 嗎？`)) {
    try {
      await api.delete(`/venues/${venue.id}`)
      await fetchVenues() // 重新加載列表
      
      // 檢查刪除後是否需要調整當前頁碼
      const maxPage = Math.ceil((venues.value.length) / itemsPerPage)
      if (currentPage.value > maxPage) {
        currentPage.value = maxPage || 1
      }
    } catch (error) {
      console.error('刪除失敗:', error)
    }
  }
}

// 獲取場地類型名稱
const getVenueTypeName = (type) => {
  const types = {
    sports: '運動場地',
    meeting: '會議室',
    event: '活動場地',
    hall: '禮堂',
  }
  return types[type] || type
}

onMounted(() => {
  fetchVenues()
})
</script>

<style scoped>
/* 搜尋框 */
.btn-outline-primary,
.btn-outline-success {
  color: #3F3F3F;
  border-color: #3F3F3F;
}

.btn-outline-primary,
.btn-outline-success:hover {
  color: #fff;
  background-color: #3F3F3F;
  border-color: #3F3F3F;
}

.btn-outline-success:active,
.btn-outline-success.active,
.btn-check:checked+.btn-outline-success {
  color: #fff;
  background-color: #3F3F3F;
  border-color: #3F3F3F;
}

.btn-outline-success:focus {
  box-shadow: 0 0 0 0.25rem rgba(63, 63, 63, 0.5);
}

.btn-warning {
  color: #fff;
  background-color: #3F3F3F;
  border-color: #3F3F3F;
}

.btn-warning:hover {
  color: #fff;
  background-color: #262626;
  border-color: #262626;
}

/* Store navBar */
.nav-link.active {
  color: black !important;
}

@media screen and (max-width: 420px) {
  .nav-item {
    font-size: 16px;
    padding: 3px;
  }

  .nav-link {
    padding: 5px 10px;
  }
}

@media screen and (max-width: 395px) {
  .nav-item {
    font-size: 14px;
    padding: 3px;
  }

  .nav-link {
    padding: 5px 10px;
  }
}

@media screen and (max-width: 365px) {
  .nav-item {
    font-size: 13px;
    padding: 3px;
  }

  .nav-link {
    padding: 5px 10px;
  }
}

@media screen and (max-width: 355px) {
  .hid {
    display: none;
  }
}

@media screen and (max-width: 345px) {
  .nav-item {
    font-size: 12px;
    padding: 3px;
  }

  .nav-link {
    padding: 5px 10px;
  }
}

/* END */


/* Table style */
table {
  text-align: center;
}

@media screen and (max-width: 768px) {
  table {
    font-size: 15px;
  }

  .btn-xs {
    padding: 0.23rem 0.35rem;
    font-size: 0.73rem;
    line-height: 1.3;
  }

}

@media screen and (max-width: 576px) {
  table {
    font-size: 14px;
  }

  .btn-xs {
    padding: 0.2rem 0.25rem;
    font-size: 0.7rem;
    line-height: 1;
  }

  /* 在小螢幕下設置按鈕全寬 */
  .btn-block {
    width: 100%;
    display: block;
    margin-bottom: 5px;
  }

}

@media screen and (max-width: 520px) {
  table {
    font-size: 13px;
  }

}

@media screen and (max-width: 495px) {
  table {
    font-size: 12px;
  }
}

@media screen and (max-width: 470px) {
  table {
    font-size: 11px;
  }
}

@media screen and (max-width: 445px) {
  table {
    font-size: 10px;
  }

}

th {
  font-weight: normal;
}

/* 訂單詳情 */
.td-border-line {
  border-bottom: #c0c8d0 solid 1px;
}

/* 增加表格的滾動功能 */
.table-responsive {
  overflow-x: auto;
}

/* END */

/* 修改 btn-danger, btn-warning 背景色 */
.btn-primary {
  background-color: #c0783e;
  border-color: #c0783e;
}

.btn-primary:hover {
  background-color: #d2852e;
  border-color: #d2852e;
}

.btn-danger:hover {
  color: #fff;
  background-color: rgb(255, 255, 255);
  border-color: rgb(255, 255, 255);
}

.btn-sm {
  padding: 4px 8px;
  margin-right: 8px;
}

.btn-danger {
  background-color: #c0783e;
  border-color: #c0783e;
  color: white;
}

.btn-danger:hover {
  background-color: #d2852e;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>