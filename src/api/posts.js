import api from './axios';

export const getFeed = (page = 1, limit = 10) =>
  api.get(`/api/posts/feed?page=${page}&limit=${limit}`).then(r => r.data);

export const getTop10 = () =>
  api.get('/api/posts/top10').then(r => r.data);

export const createPost = (data) =>
  api.post('/api/posts', data).then(r => r.data);

export const likePost = (postId) =>
  api.post(`/api/posts/${postId}/like`).then(r => r.data);

export const commentPost = (postId, content) =>
  api.post(`/api/posts/${postId}/comment`, { content }).then(r => r.data);

export const getComments = (postId) =>
  api.get(`/api/posts/${postId}/comments`).then(r => r.data);

export const getUserPosts = (userId) =>
  api.get(`/api/users/${userId}/posts`).then(r => r.data);
