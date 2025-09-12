// frontend/src/api/course.js
import api from './api';

// ---------- Course API ----------

export const createCourse = async ({ title, audience = '', duration = '', format = '' }) => {
  if (!title || typeof title !== 'string') {
    throw new Error('title is required');
  }
  const res = await api.post(
    '/courses',
    { title, audience, duration, format },
    { withCredentials: true }
  );
  return res.data;
};

export const getCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}`);
  return res.data; // { course, generated }
};
export const getCourses = async (params = '') => {
  if (typeof params === 'string') {
    const res = await api.get(`/courses${params}`);
    return res.data;
  }
  // assume object -> use axios params
  const res = await api.get('/courses', { params });
  return res.data;
};


export const updateCourse = async (courseId, payload = {}) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.put(`/courses/${courseId}`, payload);
  return res.data;
};

export const publishCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.put(`/courses/${courseId}/publish`);
  return res.data;
};

export const deleteCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.delete(`/courses/${courseId}`);
  return res.data;
};

/**
 * List courses owned by the current authenticated user (teacher).
 * Back-end expects: GET /api/courses?mine=true
 * Returns an object: { courses: [...] } or { rows: [...] } depending on your backend.
 */
export const listOwned = async () => {
  const res = await api.get('/courses', { params: { mine: true } });
  // Normalise to an array for callers
  const data = res.data;
  if (Array.isArray(data?.courses)) return data.courses;
  if (Array.isArray(data?.rows)) return data.rows;
  // If backend returns a single page object, try common shapes
  if (Array.isArray(data)) return data;
  // fallback: try data.courses or empty
  return data?.courses || [];
};

// ---------- Convenience exports ----------
export default {
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
  publishCourse,
  deleteCourse,
  listOwned
};
