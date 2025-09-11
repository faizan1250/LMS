// frontend/src/api/auth.js
// Auth helpers for frontend. Works with backend refresh cookie flow.
// Assumes you have frontend/src/api/api.js which exports an axios instance
// that reads localStorage token in a request interceptor.

import api from './api';

// ---------- Token storage helpers ----------
const ACCESS_TOKEN_KEY = 'token';

export const setLocalAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getLocalAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// ---------- Auth API calls ----------
// Note: requests that depend on the refresh cookie must include `withCredentials: true`
// so the httpOnly cookie gets sent by the browser.

export const register = async ({ name, email, password, role = 'student' }) => {
  // backend sends accessToken in response body and sets refresh cookie
  const res = await api.post(
    '/auth/register',
    { name, email, password, role },
    { withCredentials: true }
  );
  // store access token locally for API calls via Authorization header
  if (res?.data?.accessToken) {
    setLocalAccessToken(res.data.accessToken);
  }
  return res.data;
};

export const login = async ({ email, password }) => {
  // backend sends accessToken in response body and sets refresh cookie
  const res = await api.post(
    '/auth/login',
    { email, password },
    { withCredentials: true }
  );
  if (res?.data?.accessToken) {
    setLocalAccessToken(res.data.accessToken);
  }
  return res.data;
};

export const logout = async () => {
  // tell backend to revoke refresh token and clear cookie
  // include credentials so cookie is included
  const res = await api.post('/auth/logout', {}, { withCredentials: true });
  // clear local access token regardless
  setLocalAccessToken(null);
  return res.data;
};

export const refreshToken = async () => {
  // token rotation endpoint — refresh cookie is sent automatically with credentials
  // returns new access token in body (and sets a new refresh cookie)
  const res = await api.post('/auth/refresh', {}, { withCredentials: true });
  if (res?.data?.accessToken) {
    setLocalAccessToken(res.data.accessToken);
  }
  return res.data;
};

export const getMe = async () => {
  // protected endpoint that requires Authorization: Bearer <accessToken>
  // your api instance already attaches the token from localStorage
  const res = await api.get('/auth/me');
  return res.data;
};

// ---------- Automatic refresh on 401 (single retry) ----------
// This installs a response interceptor on the `api` instance to attempt a refresh
// when an API call returns 401. It will retry the original request once.
// If refresh fails, it clears local token and rejects.

let isRefreshAttemptInProgress = false;
let subscribers = [];

const onRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  subscribers.push(cb);
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // If no response or not a 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop for refresh endpoint and avoid double retry
    if (originalRequest._retry) {
      // Already retried once; give up
      // Clear local token because it's probably invalid
      setLocalAccessToken(null);
      return Promise.reject(error);
    }

    // Mark that we are retrying this request
    originalRequest._retry = true;

    // If a refresh is already in progress, queue the request and retry when done
    if (isRefreshAttemptInProgress) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            // refresh failed
            return reject(error);
          }
          // update Authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    // No refresh in progress -> perform refresh
    isRefreshAttemptInProgress = true;
    try {
      const refreshRes = await refreshToken(); // will set local token if successful
      const newAccessToken = refreshRes?.accessToken || getLocalAccessToken();

      isRefreshAttemptInProgress = false;
      onRefreshed(newAccessToken);

      if (!newAccessToken) {
        // refresh didn't yield a token
        setLocalAccessToken(null);
        return Promise.reject(error);
      }

      // set header for original request and retry
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      // refresh failed: clear token and reject original error
      isRefreshAttemptInProgress = false;
      onRefreshed(null);
      setLocalAccessToken(null);
      return Promise.reject(refreshErr);
    }
  }
);

// ---------- Convenience: bootstrap token from storage at app start ----------
export const bootstrapAuth = () => {
  const token = getLocalAccessToken();
  if (token) {
    // eslint-disable-next-line no-console
    console.debug('[auth] bootstrapped token from localStorage');
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  setLocalAccessToken,
  getLocalAccessToken,
  bootstrapAuth
};
