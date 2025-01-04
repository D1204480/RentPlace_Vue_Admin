<template>
  <div class="venue-container">
    <h1>場地管理</h1>

    <!-- 場地列表 -->
    <div v-if="venues.length" class="venue-list">
      <h2>所有場地</h2>
      <table>
        <thead>
        <tr>
          <th>地點名稱</th>
          <th>場地名稱</th>
          <th>場地類型</th>
          <th>地區名稱</th>
          <th>地址</th>
          <th>單位價格</th>
          <th>單位</th>
          <th>容量</th>
          <th>可用時間</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="venue in venues" :key="venue.id">
          <td>{{ venue.placeName }}</td>
          <td>{{ venue.venueName }}</td>
          <td>{{ venue.venueType }}</td>
          <td>{{ venue.regionName }}</td>
          <td>{{ venue.address }}</td>
          <td>{{ venue.unitPrice }}</td>
          <td>{{ venue.unit }}</td>
          <td>{{ venue.capacity }}</td>
          <td>{{ venue.availableTime }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>目前尚無場地資訊。</p>
    </div>

    <!-- 新增場地按鈕 -->
    <button @click="toggleModal" class="add-button">新增場地</button>

    <!-- 彈出視窗 (Modal) -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span @click="toggleModal" class="close">&times;</span>
        <h2>新增場地</h2>
        <form @submit.prevent="addVenue">
          <div v-for="(value, key) in venue" :key="key" class="form-group">
            <label :for="key">{{ key }}</label>
            <input
                v-model="venue[key]"
                :id="key"
                :type="key === 'unitPrice' || key === 'capacity' ? 'number' : 'text'"
                :placeholder="'輸入' + key"
            />
          </div>
          <button type="submit" class="submit-button">送出</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      venues: [], // 場地資料
      showModal: false, // 控制彈出視窗顯示
      venue: {
        placeName: "",
        venueType: "",
        venueName: "",
        regionName: "",
        address: "",
        unitPrice: null,
        unit: "",
        capacity: null,
        availableTime: "",
        remark: "",
        phoneNumber: "",
      },
    };
  },
  methods: {
    // 獲取場地列表
    async fetchVenues() {
      try {
        const response = await axios.get("http://localhost:8080/api/venues");
        this.venues = response.data;
      } catch (error) {
        console.error("獲取場地失敗", error);
      }
    },
    // 新增場地
    async addVenue() {
      try {
        const response = await axios.post("http://localhost:8080/api/venues", this.venue);
        alert("場地新增成功！");
        this.venues.push(response.data); // 更新場地列表
        this.resetForm();
        this.toggleModal();
      } catch (error) {
        console.error("新增場地失敗", error);
        alert("新增場地失敗，請檢查輸入！");
      }
    },
    // 切換彈出視窗顯示
    toggleModal() {
      this.showModal = !this.showModal;
    },
    // 重置表單
    resetForm() {
      this.venue = {
        placeName: "",
        venueType: "",
        venueName: "",
        regionName: "",
        address: "",
        unitPrice: null,
        unit: "",
        capacity: null,
        availableTime: "",
        remark: "",
        phoneNumber: "",
      };
    },
  },
  mounted() {
    this.fetchVenues();
  },
};
</script>

<style scoped>
/* 場地列表樣式 */
.venue-container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.add-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}

/* 彈出視窗樣式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.submit-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
