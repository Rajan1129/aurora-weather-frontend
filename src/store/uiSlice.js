import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    pushToast(state, action) {
      state.toasts.push(action.payload);
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { toggleSidebar, pushToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
