// frontend/src/api/test.js
import api from './api';

// ---- CRUD ----
export const createTest = async (payload) => {
  const res = await api.post('/tests', payload);
  return res.data;
};

export const listTests = async (params = {}) => {
  const res = await api.get('/tests', { params });
  return res.data;
};

export const getTest = async (id) => {
  if (!id) throw new Error('test id required');
  const res = await api.get(`/tests/${id}`);
  return res.data;
};

export const updateTest = async (id, payload) => {
  if (!id) throw new Error('test id required');
  const res = await api.put(`/tests/${id}`, payload);
  return res.data;
};

export const deleteTest = async (id) => {
  if (!id) throw new Error('test id required');
  const res = await api.delete(`/tests/${id}`);
  return res.data;
};

export const publishTest = async (id) => {
  if (!id) throw new Error('test id required');
  const res = await api.post(`/tests/${id}/publish`);
  return res.data;
};

// ---- Status / generation ----
export const pollGeneration = async (id) => {
  if (!id) throw new Error('test id required');
  // same as getTest; keep for clarity if you poll
  const res = await api.get(`/tests/${id}`);
  return res.data;
};

// ---- Stats & attempts ----
export const getTestStats = async (id) => {
  if (!id) throw new Error('test id required');
  const res = await api.get(`/tests/${id}/stats`);
  return res.data;
};

// canonical name used by UI
export const getTestAttempts = async (id, params = {}) => {
  if (!id) throw new Error('test id required');
  const res = await api.get(`/tests/${id}/attempts`, { params });
  return res.data;
};

// alias (use whichever you prefer elsewhere)
export const listAttempts = getTestAttempts;

export const submitAttempt = async (id, payload) => {
  if (!id) throw new Error('test id required');
  const res = await api.post(`/tests/${id}/attempts`, payload);
  return res.data;
};

// ---- Convenience lists ----
// add a tiny cache-buster + no-cache header and accept multiple payload shapes
export const getCourseTests = async (courseId, params = {}) => {
  if (!courseId) throw new Error('courseId required');
  const res = await api.get(`/courses/${courseId}/tests`, {
    params: { ...params, _ts: Date.now() },            // cache-buster
    headers: { 'Cache-Control': 'no-cache' },           // bypass HTTP cache
  });
  const d = res.data;
  // normalize shapes: {tests}, {rows}, {items}, array
  return {
    tests: d?.tests || d?.rows || d?.items || (Array.isArray(d) ? d : []),
  };
};

export const listMyTests = async (params = {}) => {
  const res = await api.get('/tests/me', { params });
  return res.data;
};

export default {
  createTest,
  listTests,
  getTest,
  updateTest,
  deleteTest,
  publishTest,
  pollGeneration,
  getTestStats,
  getTestAttempts,
  listAttempts,
  submitAttempt,
  getCourseTests,
  listMyTests,
};
