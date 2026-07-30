import apiClient from './client';

export const userApi = {
  updateProfile: (payload) => apiClient.patch('/users/profile', payload),
  getLocations: () => apiClient.get('/users/locations'),
  addLocation: (payload) => apiClient.post('/users/locations', payload),
  deleteLocation: (id) => apiClient.delete(`/users/locations/${id}`),
};
