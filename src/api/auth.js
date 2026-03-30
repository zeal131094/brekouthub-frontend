import api from './axios';

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password }).then(r => r.data);

export const register = (data) =>
  api.post('/api/auth/register', data).then(r => r.data);

export const getMe = () =>
  api.get('/api/auth/me').then(r => r.data);
