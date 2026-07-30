import apiClient from './client';

export const aiApi = {
  chat: (payload) => apiClient.post('/ai/chat', payload),
  getConversations: () => apiClient.get('/ai/conversations'),
};
