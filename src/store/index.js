import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import weatherReducer from './weatherSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    ui: uiReducer,
  },
});
