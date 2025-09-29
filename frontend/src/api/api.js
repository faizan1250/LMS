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

// frontend/src/api/api.js
api.interceptors.request.use((cfg) => {
  const token = getLocalAccessToken();
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };

  // --- BEGIN: test route alias rewrite ---
  // Map FE alias /courses/:courseId/tests -> /tests/courses/:courseId/tests
  // (works with optional trailing segments or query string)
  try {
    if (typeof cfg.url === 'string') {
      // preserve any query string
      const [path, qs = ''] = cfg.url.split('?');
      const m = path.match(/^\/courses\/([a-f\d]{24})\/tests(?:\/.*)?$/i);
      if (m) {
        const rest = path.slice(m[0].length); // any extra, typically empty
        cfg.url = `/tests/courses/${m[1]}/tests${rest}${qs ? `?${qs}` : ''}`;
      }
    }
  } catch {}
  // --- END: test route alias rewrite ---

  return cfg;
});

export default api;
