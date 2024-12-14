<template>

  <body class="d-flex flex-column min-vh-100">

    <!-- 營業管理 storeNavBar -->
    <div class="container-fluid fs-6">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <RouterLink to="/StoreSetView" class="nav-link link-success">營業設定</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/StoreOrderView" class="nav-link link-success active" aria-current="page">訂單管理
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/StoreMenuView" class="nav-link link-success">菜單管理</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/StoreInfoView" class="nav-link link-success">餐廳資訊</RouterLink>
        </li>
      </ul>
    </div>

    <!-- 搜尋與排序 search with checkboxes -->
    <div class="container-fluid mt-3 mb-3">
      <div style="max-width: 800px;">
        <form class="d-flex align-items-start" @submit.prevent="handleSearch">
          <!-- 搜尋框 -->
          <input class="form-control form-control-sm me-2" type="search" placeholder="Search" aria-label="Search"
            v-model="searchQuery">
          <button class="btn btn-sm btn-outline-success me-3" type="submit">Search</button>

          <!-- 依日期篩選按鈕組 -->
          <div class=" btn-group-sm" role="group" aria-label="Basic radio toggle button group"
            style="white-space: nowrap;">
            <input type="radio" class="btn-check " name="btnradio" id="btnradio1" autocomplete="off"
              v-model="filterDate" value="today">
            <label class="btn btn-outline-success" for="btnradio1" style="margin-right: 5px;">今日</label>

            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" v-model="filterDate"
              value="tomorrow">
            <label class="btn btn-outline-success" for="btnradio2" style="margin-right: 5px;">明日</label>

            <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" v-model="filterDate"
              value="week">
            <label class="btn btn-outline-success" for="btnradio3" style="margin-right: 5px;">一週內</label>

            <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" v-model="filterDate"
              value="none" checked>
            <label class="btn btn-outline-success" for="btnradio4">無</label>

          </div>
        </form>
      </div>
    </div>
    <!-- 訂單 table -->
    <div class="container-fluid">
      <div class="card mt-3 mb-3 p-2">
        <div class="table-responsive">
          <table class="table">
            <thead style="white-space: nowrap;">
              <tr>
                <th scope="col">訂單編號</th>
                <th scope="col">訂單日期</th>
                <th scope="col">預約者編號</th>
                <th scope="col">訂單內容</th>
                <th scope="col">付款狀態</th>
                <th scope="col">取消訂單</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.orderId">
                <th scope="row">{{ order.orderId }}</th>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>{{ order.userId }}</td>
                <td>{{ order.payment?.paymentMethodDisplay || '-' }}</td>
                <td>{{ order.status?.status || '-' }}</td>
                <td style="white-space: nowrap;">
                  <a class="btn btn-warning btn-sm btn-xs btn-block" 
                     :data-bs-toggle="'collapse'"
                     :href="'#collapseOrder' + order.orderId" 
                     role="button" 
                     aria-expanded="false"
                     :aria-controls="'collapseOrder' + order.orderId" 
                     @click="getDataByOrderId(order.orderId)">
                    訂單詳情
                  </a>
                </td>
                <td id="orderStatus1">-</td>

                <!-- delete button -->
                <td>
                  <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteMenuModal"
                    v-on:click="onSelectOrder(order)" :disabled="order.status?.statusId === 7"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      fill="#dc3545" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path
                        d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5">
                      </path>
                    </svg></button>
                </td>
              </tr>

              <!-- test 訂單詳情區 -->
              <tr class="collapse" :id="'collapseOrder' + order.orderID">
                <td colspan="8">
                  <div style="border-radius: 10px; background-color: #fff3cd;">
                    <div class="container-fluid">
                      <div class="d-flex justify-content-between p-3">
                        <h5>訂購人 : <span>{{ order.customerName }}</span></h5>
                        <button type="button" class="btn btn-success btn-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-telephone-outbound-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5">
                            </path>
                          </svg>
                          聯絡訂購人
                        </button>
                      </div>

                      <!-- 訂單詳細品項表格 -->
                      <table class="table mb-3 table-borderless table-responsive table-warning text-start">
                        <thead class="td-border-line">
                          <tr>
                            <th scope="col">訂購品項</th>
                            <th scope="col">數量</th>
                            <th scope="col" class="text-start">訂單備註</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in getOrderItems(order.orderID)" :key="item.orderID">
                            <th scope="row">{{ item.menuItem }}</th>
                            <td>x{{ item.quantity }}</td>
                            <td style="word-wrap: break-word; width: 50%;">
                              {{ item.notes }}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- 訂單狀態選單 -->
                      <div class="d-flex justify-content-end">
                        <div class="p-3 d-flex align-items-center" style="width: 250px;">
                          <span style="color: #961b28;white-space: nowrap;">備餐狀態：</span>
                          <select class="form-select form-select-sm" aria-label=".form-select-sm example"
                            onchange="updateOrderStatus(this, 'orderStatus1')">
                            <option value="-" selected>請選擇狀態</option>
                            <option value="備餐中">備餐中</option>
                            <option value="備餐完畢">備餐完畢</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>

  <!-- Delete Order Modal -->
  <div class="modal fade" id="deleteMenuModal" tabindex="-1" aria-labelledby="deleteMenuModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Delete Order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this order?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="deleteOrder">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [], // API 取得的訂單資料
      orderDetails: {}, // 儲存各訂單的詳細資料
      filterDate: 'none', // 預設篩選條件
      searchQuery: '', // 搜尋關鍵字
      keyword: "",
      selectedOrder: {
        orderID: "",  // 訂單 ID
        orderDate: "",
        etd: "",
        customerName: "",
        quantity: "",
        menuItem: "",
        notes: "",
        orderStatusID: "",  // 訂單狀態 ID
      },
    };
  },

  computed: {
    filteredOrders() {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const oneWeekLater = new Date();
      oneWeekLater.setDate(today.getDate() + 7);

      // 如果 filterDate 是 'none'，返回所有訂單
      if (this.filterDate === 'none') {
        return this.orders.filter(order => {
          // 根據搜尋關鍵字篩選(顧客姓名)
          return order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }

      const filtered = this.orders.filter(order => {
        const orderDate = new Date(order.orderDate);

        // 根據日期篩選
        let dateMatch = false;
        if (this.filterDate === 'today') {
          dateMatch = orderDate.toDateString() === today.toDateString();
        } else if (this.filterDate === 'tomorrow') {
          dateMatch = orderDate.toDateString() === tomorrow.toDateString();
        } else if (this.filterDate === 'week') {
          dateMatch = orderDate >= today && orderDate <= oneWeekLater;
        }

        // 根據搜尋關鍵字篩選
        const searchMatch = order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());

        return dateMatch && searchMatch;
      });

      console.log('Filtered Orders:', filtered); // 印出過濾後的訂單
      return filtered;
    },
  },


  methods: {
    handleSearch() {
      // 搜索功能由 filteredOrders 計算屬性自動處理，所以這裡不需要額外邏輯
      console.log("Searching for:", this.searchQuery);
      this.searchQuery = '';  // 清空搜尋欄
    },

    async getData() {
      try {
        const response = await axios.get("http://localhost:8080/api/orders");
        this.orders = response.data;
        console.log("Orders data:", this.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

    async getDataByOrderId(orderID) {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderID}`);
        // 直接使用響應式賦值
        this.orderDetails = {
          ...this.orderDetails,   // 保留原有的所有訂單數據
          [orderID]: response.data   // 添加新的訂單數據
        };
      } catch (error) {
        console.error('獲取訂單詳情失敗:', error);
      }
    },

    // 獲取特定訂單的詳細品項
    getOrderItems(orderID) {
      return this.orderDetails[orderID] || [];
    },


    async search() {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/name/${this.keyword}`);
        this.orders = response.data;
        console.log("Search results:", this.orders);
      } catch (error) {
        console.error("Error searching orders:", error);
      }
    },

    onSelectOrder(order) {
      this.selectedOrder = order;
    },

    // 取消訂單
    async deleteOrder() {
      try {
        this.selectedOrder.orderStatusID = 7;
        await axios.put("http://localhost:8080/api/orders", this.selectedOrder, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        await this.getData(); // 重新取得訂單資料
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    },

  },

  created() {
    this.getData();
  },
};
</script>

<style scoped>
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
.btn-danger,
.btn-danger:hover {
  color: #fff;
  background-color: rgb(255, 255, 255);
  border-color: rgb(255, 255, 255);
}
</style>
