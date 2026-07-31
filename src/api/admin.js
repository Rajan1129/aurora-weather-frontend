// src/api/admin.js
import axios from 'axios';
import { API_URL } from "../config";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests - THIS HANDLES TOKEN AUTOMATICALLY
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

    } else {

    }
    return config;
  },
  (error) => {
    console.error('❌ Admin API - Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    console.error('❌ Admin API - Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Dashboard Stats - REMOVE the token parameter
  getStats: () => api.get('/admin/stats'),
  
  // User Management
  getUsers: (page = 1, limit = 20, search = '') => 
    api.get('/admin/users', { params: { page, limit, search } }),
  
  updateUser: (userId, data) => 
    api.put(`/admin/users/${userId}`, data),
  
  deleteUser: (userId) => 
    api.delete(`/admin/users/${userId}`),
  
  // System Logs
  getLogs: () => api.get('/admin/logs'),
  
  // Weather Analytics
  getWeatherAnalytics: () => api.get('/admin/weather-analytics'),
  
  // AI Analytics
  getAIAnalytics: () => api.get('/admin/ai-analytics'),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Reports
  generateReport: (data) => api.post('/admin/reports/generate', data),
};

export default adminApi;
