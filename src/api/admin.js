import axios from 'axios';
import { API_URL } from "../config";

// 1. Create the main api instance ONCE
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an interceptor to automatically attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Export the adminApi object (ONLY ONCE)
export const adminApi = {
  // Dashboard Stats
  getStats: () => api.get('/admin/stats'),

  // User Management
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Weather Data Management
  getWeatherLogs: (params) => api.get('/admin/weather-logs', { params }),
  
  // AI Assistant Management
  getAILogs: (params) => api.get('/admin/ai-logs', { params }),

  // System Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

// 4. Export the base api instance if you need to use it directly elsewhere
export { api };