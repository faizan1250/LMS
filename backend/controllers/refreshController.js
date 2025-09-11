// backend/controllers/refreshController.js
import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { refreshCookieOptions, REFRESH_TOKEN_COOKIE_NAME, clearRefreshCookie } from '../utils/cookieOptions.js';

const createRandomToken = () => crypto.randomBytes(40).toString('hex');

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const existing = await RefreshToken.findOne({ token }).exec();
    if (!existing) {
      // token unknown -> possible reuse or tampering
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // check revoked or expired
    if (existing.revokedAt || existing.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, message: 'Refresh token expired or revoked' });
    }

    // rotate: revoke existing and create new
    const newTokenString = createRandomToken();
    const newExpiresAt = new Date(Date.now() + (process.env.REFRESH_TOKEN_TTL_MS ? Number(process.env.REFRESH_TOKEN_TTL_MS) : 30 * 24 * 60 * 60 * 1000));

    existing.revokedAt = new Date();
    existing.revokedByIp = req.ip;
    existing.replacedByToken = newTokenString;
    await existing.save();

    const newRefresh = new RefreshToken({
      token: newTokenString,
      user: existing.user,
      expiresAt: newExpiresAt,
      createdByIp: req.ip
    });
    await newRefresh.save();

    // issue new access token
    const accessToken = generateToken(existing.user);

    // set new cookie
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, newTokenString, refreshCookieOptions);

    return res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};
