export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TEMP_UNITS = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ASSISTANT: '/assistant',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  PREMIUM: '/premium',
  ADMIN: '/admin',
};
