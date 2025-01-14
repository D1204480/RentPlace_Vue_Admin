// src/api/index.js
import axios from 'axios'

const api = axios.create({
  // 直接使用相對路徑，讓 Vite 的代理來處理
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
api.interceptors.request.use(
  config => {
    // 可以在這裡加入 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 處理不同的錯誤狀態
      switch (error.response.status) {
        case 401:
          // 未授權，可以導向登入頁
          break
        case 403:
          // 無權限
          break
        case 404:
          // 資源不存在
          break
        case 500:
          // 伺服器錯誤
          break
      }
    }
    return Promise.reject(error)
  }
)

export default api