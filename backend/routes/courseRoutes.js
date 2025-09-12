// backend/routes/courseRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import * as controller from '../controllers/courseController.js';

const router = express.Router();

// POST /api/courses
// Only authenticated teachers or admins can create courses
router.post('/', protect, authorize('teacher', 'admin'), controller.createCourse);

// GET /api/courses/:id
// Any authenticated user can fetch a course; controller will enforce finer permissions if needed
router.get('/:id', protect, controller.getCourse);
router.get('/', protect, controller.listCourses);

// PUT /api/courses/:id
// Only the teacher who created the course (or admins) should edit — controller should enforce ownership
router.put('/:id', protect, authorize('teacher', 'admin'), controller.updateCourse);

// PUT /api/courses/:id/publish
// Only teachers/admins
router.put('/:id/publish', protect, authorize('teacher', 'admin'), controller.publishCourse);

// DELETE /api/courses/:id
// Only teachers/admins
router.delete('/:id', protect, authorize('teacher', 'admin'), controller.deleteCourse);

export default router;
