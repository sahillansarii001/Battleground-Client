import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      if (typeof window !== 'undefined') {
        // Dispatch a custom event instead of hard reloading
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;