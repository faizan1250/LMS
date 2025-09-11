// backend/controllers/authController.js
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { refreshCookieOptions, REFRESH_TOKEN_COOKIE_NAME, clearRefreshCookie } from '../utils/cookieOptions.js';

const createRandomToken = () => crypto.randomBytes(40).toString('hex');

const sendAuthResponse = async (res, user, reqIp = '', statusCode = 200) => {
  const accessToken = generateToken(user._id);

  // Create refresh token record
  const tokenString = createRandomToken();
  const expiresAt = new Date(Date.now() + (process.env.REFRESH_TOKEN_TTL_MS ? Number(process.env.REFRESH_TOKEN_TTL_MS) : 30 * 24 * 60 * 60 * 1000)); // default 30d

  const refreshTokenDoc = new RefreshToken({
    token: tokenString,
    user: user._id,
    expiresAt,
    createdByIp: reqIp
  });

  await refreshTokenDoc.save();

  // Set refresh cookie (httpOnly)
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokenString, refreshCookieOptions);

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  return res.status(statusCode).json({ success: true, accessToken, user: safeUser });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role });
    await sendAuthResponse(res, user, req.ip, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    await sendAuthResponse(res, user, req.ip, 200);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (token) {
      const existing = await RefreshToken.findOne({ token });
      if (existing && existing.isActive) {
        existing.revokedAt = new Date();
        existing.revokedByIp = req.ip;
        await existing.save();
      }
    }

    // clear cookie
    clearRefreshCookie(res);
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // authMiddleware attaches req.user
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
