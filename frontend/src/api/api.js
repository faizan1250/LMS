// frontend/src/api/api.js
import axios from 'axios';
import { getLocalAccessToken, setLocalAccessToken, refreshToken } from './auth'; // adapt per your auth module

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies (refresh token) with requests
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// request interceptor: attach access token
api.interceptors.request.use((cfg) => {
  const token = getLocalAccessToken();
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  return cfg;
});

// single-refresh-on-401 response interceptor
let isRefreshing = false;
let queue = [];

const processQueue = (err, token = null) => {
  queue.forEach(({ resolve, reject }) => {
    if (err) reject(err);
    else resolve(token);
  });
  queue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue requests until refresh is done
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;
      try {
        // refreshToken() should call POST /auth/refresh with credentials and set local token if successful
        const refreshRes = await refreshToken();
        const newToken = refreshRes?.accessToken;
        if (!newToken) {
          throw new Error('refresh did not return token');
        }
        setLocalAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        setLocalAccessToken(null);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
