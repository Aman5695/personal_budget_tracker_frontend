// src/api.js
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL:'https://personal-budget-tracker-backend-irzv.onrender.com/api',
  timeout: 10000 // Optional: helps avoid hanging requests
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status } = error.response;
  
        if (status === 401) {
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
  

export default api;
