import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log("===============");
console.log("API_URL:", API_URL);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("===============");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add token
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

// Response interceptor for error handling - FIXED to prevent loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 if not already on login page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on login page
      if (!currentPath.includes('/auth/login') && !currentPath.includes('/auth/register')) {
        console.warn('Unauthorized access, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only show toast if not already showing
        if (!sessionStorage.getItem('authRedirecting')) {
          sessionStorage.setItem('authRedirecting', 'true');
          toast.error('Session expired. Please login again.');
          
          setTimeout(() => {
            sessionStorage.removeItem('authRedirecting');
            window.location.href = '/auth/login';
          }, 1000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;