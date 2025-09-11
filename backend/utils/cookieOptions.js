// backend/utils/cookieOptions.js
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

const DEFAULT_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',         // change to 'strict' if you want stricter CSRF defense
  path: '/api/auth/refresh',
  maxAge: process.env.REFRESH_TOKEN_EXPIRES_MS ? Number(process.env.REFRESH_TOKEN_EXPIRES_MS) : DEFAULT_MAX_AGE
};

export const clearRefreshCookie = (res) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, 'none', {
    httpOnly: true,
    expires: new Date(0),
    path: '/api/auth/refresh'
  });
};
