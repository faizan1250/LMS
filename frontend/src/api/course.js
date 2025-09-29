// // frontend/src/api/course.js
// import api from './api';

// // ---------- Course API ----------

// export const createCourse = async ({ title, audience = '', duration = '', format = '' }) => {
//   if (!title || typeof title !== 'string') throw new Error('title is required');
//   const res = await api.post(
//     '/courses',
//     { title, audience, duration, format },
//     { withCredentials: true }
//   );
//   return res.data;
// };

// export const getCourse = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.get(`/courses/${courseId}`);
//   return res.data; // { course, generated, meta }
// };

// export const getCourses = async (params = '') => {
//   if (typeof params === 'string') {
//     const res = await api.get(`/courses${params}`);
//     return res.data;
//   }
//   const res = await api.get('/courses', { params });
//   return res.data;
// };

// export const updateCourse = async (courseId, payload = {}) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.put(`/courses/${courseId}`, payload);
//   return res.data;
// };

// export const publishCourse = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.put(`/courses/${courseId}/publish`);
//   return res.data;
// };

// export const deleteCourse = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.delete(`/courses/${courseId}`);
//   return res.data;
// };

// /**
//  * List courses owned by the current authenticated user (teacher).
//  * GET /courses?mine=true
//  */
// export const listOwned = async () => {
//   const res = await api.get('/courses', { params: { mine: true } });
//   const data = res.data;
//   if (Array.isArray(data?.courses)) return data.courses;
//   if (Array.isArray(data?.rows)) return data.rows;
//   if (Array.isArray(data)) return data;
//   return data?.courses || [];
// };

// /* -------- Student features -------- */

// // Enroll
// export const enrollInCourse = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.post(`/courses/${courseId}/enroll`);
//   return res.data;
// };

// // Unenroll
// export const unenrollFromCourse = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.delete(`/courses/${courseId}/enroll`);
//   return res.data;
// };

// // My enrollments
// export const getMyEnrollments = async () => {
//   const res = await api.get('/courses/me/enrollments');
//   return res.data; // { courses: [...] }
// };

// /**
//  * Update progress for a single lesson (gated by assignment).
//  * PATCH /courses/:id/progress { lessonId, completed }
//  */
// export const updateLessonProgress = async (courseId, { lessonId, completed }) => {
//   if (!courseId) throw new Error('courseId is required');
//   if (!lessonId) throw new Error('lessonId is required');
//   const res = await api.patch(
//     `/courses/${courseId}/progress`,
//     { lessonId, completed: !!completed },
//     { withCredentials: true }
//   );
//   return res.data; // { ok, progress: { percent, completedCount } }
// };

// /**
//  * Backward-compat alias. If called with object -> delegates to updateLessonProgress.
//  * Remove numeric-progress behavior (no longer supported by BE).
//  */
// export const updateProgress = async (courseId, payload) => {
//   if (payload && typeof payload === 'object' && 'lessonId' in payload) {
//     return updateLessonProgress(courseId, payload);
//   }
//   throw new Error('updateProgress now requires { lessonId, completed }');
// };

// // Progress fetch (student; teachers can pass { userId } via params)
// export const getProgress = async (courseId, params = undefined) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.get(`/courses/${courseId}/progress`, { params });
//   return res.data;
// };

// // Bookmarks add
// export const addBookmark = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.post(`/courses/${courseId}/bookmark`);
//   return res.data;
// };

// // Bookmarks remove
// export const removeBookmark = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.delete(`/courses/${courseId}/bookmark`);
//   return res.data;
// };

// // My bookmarks
// export const getMyBookmarks = async () => {
//   const res = await api.get('/courses/me/bookmarks');
//   return res.data; // { courses: [...] }
// };

// // Ratings create/update
// export const rateCourse = async (courseId, { rating, review } = {}) => {
//   if (!courseId) throw new Error('courseId is required');
//   if (rating == null) throw new Error('rating is required');
//   const res = await api.post(`/courses/${courseId}/rate`, { rating, review });
//   return res.data;
// };

// // Ratings list
// export const getCourseRatings = async (courseId) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.get(`/courses/${courseId}/ratings`);
//   return res.data; // { ratings, summary, page, limit }
// };

// /* -------- Teacher views -------- */

// export const listEnrolledStudents = async (courseId, params = {}) => {
//   if (!courseId) throw new Error('courseId is required');
//   const res = await api.get(`/courses/${courseId}/students`, { params, withCredentials: true });
//   return res.data;
// };

// /* -------- New: assignments & quizzes -------- */

// /**
//  * Submit a lesson assignment to unblock completion.
//  * POST /courses/:id/lessons/:lessonId/assignment/submit
//  */
// export const submitLessonAssignment = async (courseId, lessonId, payload = {}) => {
//   if (!courseId) throw new Error('courseId is required');
//   if (!lessonId) throw new Error('lessonId is required');
//   const res = await api.post(
//     `/courses/${courseId}/lessons/${lessonId}/assignment/submit`,
//     { payload },
//     { withCredentials: true }
//   );
//   return res.data; // { ok, assignment: { lessonId, submitted: true } }
// };

// /**
//  * Attempt a module quiz.
//  * POST /courses/:id/modules/:moduleId/quiz/attempt { answers: number[] }
//  */
// export const attemptModuleQuiz = async (courseId, moduleId, answers = []) => {
//   if (!courseId) throw new Error('courseId is required');
//   if (!moduleId) throw new Error('moduleId is required');
//   if (!Array.isArray(answers)) throw new Error('answers must be an array');
//   const res = await api.post(
//     `/courses/${courseId}/modules/${moduleId}/quiz/attempt`,
//     { answers },
//     { withCredentials: true }
//   );
//   return res.data; // { ok, result: { correct, total, scorePercent, passed } }
// };

// /**
//  * Get per-module status (quiz pass, lesson completion counts).
//  * GET /courses/:id/modules/:moduleId/status
//  */
// export const getModuleStatus = async (courseId, moduleId) => {
//   if (!courseId) throw new Error('courseId is required');
//   if (!moduleId) throw new Error('moduleId is required');
//   const res = await api.get(`/courses/${courseId}/modules/${moduleId}/status`);
//   return res.data; // { module: {...}, quiz: {...}, lessons: {...} }
// };

// // ---------- Convenience exports ----------
// export default {
//   createCourse,
//   getCourse,
//   getCourses,
//   updateCourse,
//   publishCourse,
//   deleteCourse,
//   listOwned,
//   enrollInCourse,
//   unenrollFromCourse,
//   getMyEnrollments,
//   updateLessonProgress,
//   updateProgress, // alias with new contract
//   getProgress,
//   addBookmark,
//   removeBookmark,
//   getMyBookmarks,
//   rateCourse,
//   getCourseRatings,
//   listEnrolledStudents,
//   submitLessonAssignment,
//   attemptModuleQuiz,
//   getModuleStatus
// };

// frontend/src/api/course.js
import api from './api';

// ---------- Course API ----------
export const createCourse = async ({ title, audience = '', duration = '', format = '' }) => {
  if (!title || typeof title !== 'string') throw new Error('title is required');
  const res = await api.post('/courses', { title, audience, duration, format }, { withCredentials: true });
  return res.data;
};

export const getCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}`);
  return res.data;
};

export const getCourses = async (params = '') => {
  if (typeof params === 'string') {
    const res = await api.get(`/courses${params}`);
    return res.data;
  }
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

export const listOwned = async () => {
  const res = await api.get('/courses', { params: { mine: true } });
  const data = res.data;
  if (Array.isArray(data?.courses)) return data.courses;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data)) return data;
  return data?.courses || [];
};

/* -------- Student features -------- */

export const enrollInCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.post(`/courses/${courseId}/enroll`);
  return res.data;
};

export const unenrollFromCourse = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.delete(`/courses/${courseId}/enroll`);
  return res.data;
};

export const getMyEnrollments = async () => {
  const res = await api.get('/courses/me/enrollments');
  return res.data;
};

// Deprecated percent-based progress (kept for compatibility)
export const updateProgress = async (courseId, value) => {
  if (!courseId) throw new Error('courseId is required');
  const n = Math.max(0, Math.min(100, Math.round(Number(value))));
  if (!Number.isFinite(n)) throw new Error('progress must be a number 0..100');
  const res = await api.patch(`/courses/${courseId}/progress`, { progress: n }, { withCredentials: true });
  return res.data;
};

// New lesson-completion progress
export const updateLessonProgress = async (courseId, { lessonId, completed }) => {
  if (!courseId) throw new Error('courseId is required');
  if (!lessonId) throw new Error('lessonId is required');
  const res = await api.patch(
    `/courses/${courseId}/progress`,
    { lessonId, completed: !!completed },
    { withCredentials: true }
  );
  return res.data; // { ok, progress: { percent, completedCount } }
};

export const getProgress = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}/progress`);
  return res.data;
};

export const addBookmark = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.post(`/courses/${courseId}/bookmark`);
  return res.data;
};

export const removeBookmark = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.delete(`/courses/${courseId}/bookmark`);
  return res.data;
};

export const getMyBookmarks = async () => {
  const res = await api.get('/courses/me/bookmarks');
  return res.data;
};

export const rateCourse = async (courseId, { rating, review } = {}) => {
  if (!courseId) throw new Error('courseId is required');
  if (rating == null) throw new Error('rating is required');
  const res = await api.post(`/courses/${courseId}/rate`, { rating, review });
  return res.data;
};

export const getCourseRatings = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}/ratings`);
  return res.data;
};

/* -------- Teacher views -------- */

export const listEnrolledStudents = async (courseId, params = {}) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}/students`, { params, withCredentials: true });
  return res.data;
};

/* -------- NEW endpoints for assignments & quizzes -------- */

// Submit a lesson assignment
export const submitAssignment = async (courseId, lessonId, payload = {}) => {
  if (!courseId) throw new Error('courseId is required');
  if (!lessonId) throw new Error('lessonId is required');
  const res = await api.post(
    `/courses/${courseId}/lessons/${lessonId}/assignment/submit`,
    payload, // { content, files?, links? }
    { withCredentials: true }
  );
  return res.data; // { ok, submissionId, message? }
};

// Attempt a module quiz
export const attemptModuleQuiz = async (courseId, moduleId, { answers } = {}) => {
  if (!courseId) throw new Error('courseId is required');
  if (!moduleId) throw new Error('moduleId is required');
  if (!Array.isArray(answers)) throw new Error('answers array is required');
  const res = await api.post(
    `/courses/${courseId}/modules/${moduleId}/quiz/attempt`,
    { answers },
    { withCredentials: true }
  );
  return res.data; // { ok, passed, scorePercent, correctCount, total }
};

// Optional: fetch per-module status
export const getModuleStatus = async (courseId, moduleId) => {
  if (!courseId) throw new Error('courseId is required');
  if (!moduleId) throw new Error('moduleId is required');
  const res = await api.get(`/courses/${courseId}/modules/${moduleId}/status`);
  return res.data; // { lessonsCompleted, assignmentsPending, quizPassed }
};

export const listAssignmentSubmissions = async (courseId) => {
  if (!courseId) throw new Error('courseId is required');
  const res = await api.get(`/courses/${courseId}/assignments/submissions`, { withCredentials: true });
  return res.data; // { submissions: [...] }
};

// --- Assignments: grade one submission for a lesson ---
export const gradeAssignment = async (courseId, lessonId, { userId, grade, feedback }) => {
  if (!courseId) throw new Error('courseId is required');
  if (!lessonId) throw new Error('lessonId is required');
  if (!userId) throw new Error('userId is required');
  const res = await api.post(
    `/courses/${courseId}/lessons/${lessonId}/assignment/grade`,
    { userId, grade, feedback },
    { withCredentials: true }
  );
  return res.data; // { ok: true, updated: {...} }
};


// ---------- Convenience exports ----------
export default {
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
  publishCourse,
  deleteCourse,
  listOwned,
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  updateProgress,
  getProgress,
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  rateCourse,
  getCourseRatings,
  listEnrolledStudents,
  updateLessonProgress,
  submitAssignment,
  attemptModuleQuiz,
  getModuleStatus,
  listAssignmentSubmissions,
  gradeAssignment
};
