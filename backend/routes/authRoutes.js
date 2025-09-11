// backend/routes/authRoutes.js
import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { refresh } from '../controllers/refreshController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// refresh endpoint - cookie-only refresh flow
router.post('/refresh', refresh);

// protected user info
router.get('/me', protect, getMe);

export default router;
