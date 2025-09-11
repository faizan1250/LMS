// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
//  console.log('[axios] token', token);   // 👀 see if it exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




export default api;
