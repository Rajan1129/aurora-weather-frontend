import apiClient from './client';

export const weatherApi = {
  getCurrent: (lat, lon) => apiClient.get('/weather/current', { params: { lat, lon } }),
};
