// src/api/venues.js
import api from './index'

export const venueApi = {
  // 獲取場地列表
  getAll: (params) => api.get('/venues', { params }),
  
  // 獲取單個場地
  getById: (id) => api.get(`/venues/${id}`),
  
  // 創建場地
  create: (data) => {
    // 如果有文件上傳，使用 FormData
    if (data.imageName instanceof File) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'imageName') {
          formData.append('image', data[key])
        } else {
          formData.append(key, data[key])
        }
      })
      return api.post('/venues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    return api.post('/venues', data)
  },
  
  // 更新場地
  update: (id, data) => {
    // 如果有文件上傳，使用 FormData
    if (data.imageName instanceof File) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'imageName') {
          formData.append('image', data[key])
        } else {
          formData.append(key, data[key])
        }
      })
      return api.put(`/venues/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    return api.put(`/venues/${id}`, data)
  },
  
  // 刪除場地
  delete: (id) => api.delete(`/venues/${id}`)
}

// 如果需要導出其他 API，可以在這裡添加
export default venueApi