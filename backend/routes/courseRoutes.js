// backend/routes/courseRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import * as controller from '../controllers/courseController.js';

const router = express.Router();

// Read + search/filter
router.post('/', protect, authorize('teacher','admin'), controller.createCourse);
router.get('/', protect, controller.listCourses);

// ---- keep before any `/:id` routes ----
router.get('/me/enrollments', protect, authorize('student'), controller.myEnrollments);
router.get('/me/bookmarks', protect, authorize('student'), controller.myBookmarks);
// --------------------------------------

// Single-course + nested
router.get('/:id', protect, controller.getCourse);
router.put('/:id', protect, authorize('teacher','admin'), controller.updateCourse);
router.put('/:id/publish', protect, authorize('teacher','admin'), controller.publishCourse);
router.delete('/:id', protect, authorize('teacher','admin'), controller.deleteCourse);

// Student features on a specific id
router.post('/:id/enroll', protect, authorize('student'), controller.enrollInCourse);
router.delete('/:id/enroll', protect, authorize('student'), controller.unenrollFromCourse);
router.patch('/:id/progress', protect, authorize('student'), controller.updateProgress);
router.get('/:id/progress', protect, controller.getProgress);
router.post('/:id/bookmark', protect, authorize('student'), controller.addBookmark);
router.delete('/:id/bookmark', protect, authorize('student'), controller.removeBookmark);
router.post('/:id/rate', protect, authorize('student'), controller.rateCourse);
router.get('/:id/ratings', protect, controller.listRatings);
router.get('/:id/students', protect, authorize('teacher','admin'), controller.listEnrolledStudents);

// NEW: lesson assignment submit
router.post(
  '/:id/lessons/:lessonId/assignment/submit',
  protect,
  authorize('student'),
  controller.submitAssignment
);

// NEW: module quiz attempt
router.post(
  '/:id/modules/:moduleId/quiz/attempt',
  protect,
  authorize('student'),
  controller.attemptModuleQuiz
);

// NEW: per-module status (quiz pass, lesson gate)
router.get(
  '/:id/modules/:moduleId/status',
  protect,
  controller.getModuleStatus
);
router.get(
  '/:id/assignments/submissions',
  protect,
  authorize('teacher','admin'),
  controller.listAssignmentSubmissions
);

// --- Teacher: grade a specific student's lesson assignment ---
router.post(
  '/:id/lessons/:lessonId/assignment/grade',
  protect,
  authorize('teacher','admin'),
  controller.gradeAssignment
);

// --- Additional Course Management Routes ---
router.get('/categories', protect, controller.getCourseCategories);
router.get('/search', protect, controller.searchCourses);
router.get('/:id/stats', protect, authorize('teacher','admin'), controller.getCourseStats);

export default router;
