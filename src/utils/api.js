import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk handling response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server merespons dengan status code di luar range 2xx
      switch (error.response.status) {
        case 401:
          // Unauthorized - hapus token dan redirect ke login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('Anda tidak memiliki akses untuk melakukan operasi ini');
          break;
        case 404:
          message.error('Data tidak ditemukan');
          break;
        case 500:
          message.error('Terjadi kesalahan pada server');
          break;
        default:
          message.error(error.response.data?.message || 'Terjadi kesalahan');
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      message.error('Tidak dapat terhubung ke server');
    } else {
      // Ada error saat setup request
      message.error('Terjadi kesalahan saat memproses request');
    }
    return Promise.reject(error);
  }
);

export default api; 