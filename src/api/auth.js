// src/api/auth.js
import axios from 'axios';
import { API_URL } from '../config'; // ✅ Import from config

// Create axios instance with default config - Use API_URL from config
const api = axios.create({
  baseURL: `${API_URL}/api`, // Append /api to the base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  guestLogin: () => api.post('/auth/guest'),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
};

// ==================== WEATHER API ====================
export const weatherApi = {
  // Current weather
  getCurrentWeather: (lat, lng) => 
    api.get('/weather/current', { params: { lat, lng } }),
  
  // Hourly forecast
  getHourlyForecast: (lat, lng, hours = 24) => 
    api.get('/weather/hourly', { params: { lat, lng, hours } }),
  
  // Daily forecast
  getDailyForecast: (lat, lng, days = 7) => 
    api.get('/weather/daily', { params: { lat, lng, days } }),
  
  // Air quality
  getAirQuality: (lat, lng) => 
    api.get('/weather/air-quality', { params: { lat, lng } }),
  
  // Search cities
  searchCities: (query) => 
    api.get('/cities/search', { params: { q: query } }),
};

// ==================== AI API ====================
export const aiApi = {
  // Daily summary
  getDailySummary: () => 
    api.get('/ai/daily-summary'),
  
  // Outfit recommendations
  getOutfitRecommendation: (occasion = 'casual') => 
    api.get('/ai/outfit', { params: { occasion } }),
  
  // Mood forecast
  getMoodForecast: () => 
    api.get('/ai/mood'),
  
  // Impact score
  getImpactScore: () => 
    api.get('/ai/impact-score'),
  
  // AI Conversation
  sendMessage: (message, type = 'chat', location = {}, weatherData = {}) => 
    api.post('/ai/conversation', { 
      message, 
      type, 
      location, 
      weatherData 
    }),
};

// ==================== DEFAULT EXPORT ====================
export default {
  auth: authApi,
  weather: weatherApi,
  ai: aiApi,
};