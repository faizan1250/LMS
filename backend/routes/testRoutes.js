// backend/routes/testRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import * as ctrl from '../controllers/testcontroller.js';

const router = express.Router();

/**
 * STUDENT-FIRST (specific) ROUTES
 * Put these BEFORE any `/:id` routes so they don't get swallowed.
 */

// list tests for a course (published filter supported)
router.get('/courses/:courseId/tests', protect, ctrl.listTestsByCourse);

// published tests for a course (student view)
router.get('/course/:courseId/published', protect, authorize('student'), ctrl.listCoursePublished);

// fetch a single published test (student view)
router.get('/published/:id', protect, authorize('student'), ctrl.getPublishedTest);

// submit attempt (student)
router.post('/:id/submit', protect, authorize('student'), ctrl.submitAttempt);

/**
 * TEACHER ROUTES
 */
router.post('/', protect, authorize('teacher','admin'), ctrl.createTest);
router.get('/', protect, authorize('teacher','admin'), ctrl.listTests);
router.get('/:id', protect, authorize('teacher','admin'), ctrl.getTest);
router.put('/:id', protect, authorize('teacher','admin'), ctrl.updateTest);
router.put('/:id/publish', protect, authorize('teacher','admin'), ctrl.publishTest);
router.get('/:id/stats', protect, authorize('teacher','admin'), ctrl.testStats);
router.get('/:id/leaderboard', protect, authorize('teacher','admin'), ctrl.leaderboard);
router.get('/:id/submissions', protect, authorize('teacher','admin'), ctrl.listSubmissions);

export default router;
