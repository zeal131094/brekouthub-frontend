import axios from 'axios';

// VITE_BACKEND_URL takes priority; falls back to Render.com production backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://brekouthub-backend.onrender.com';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brekout_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/welcome')) {
        localStorage.removeItem('brekout_token');
        localStorage.removeItem('brekout_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
