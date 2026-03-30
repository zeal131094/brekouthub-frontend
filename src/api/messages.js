import api from './axios';

export const getConversations = () =>
  api.get('/api/messages/conversations').then(r => r.data);

export const getMessages = (userId) =>
  api.get(`/api/messages/${userId}`).then(r => r.data);

export const sendMessage = (userId, content) =>
  api.post(`/api/messages/${userId}`, { content }).then(r => r.data);

export const getNotifications = () =>
  api.get('/api/notifications').then(r => r.data);

export const markNotificationRead = (id) =>
  api.put(`/api/notifications/${id}/read`).then(r => r.data);

export const markAllNotificationsRead = () =>
  api.put('/api/notifications/read-all').then(r => r.data);

export const getUser = (id) =>
  api.get(`/api/users/${id}`).then(r => r.data);

export const followUser = (id) =>
  api.post(`/api/users/${id}/follow`).then(r => r.data);
