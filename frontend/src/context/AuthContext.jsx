import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import authApi from '../api/auth'; // the auth helper you already added

// Context
const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // whether initial bootstrap is done
  const [loading, setLoading] = useState(false); // for actions like login/register
  const [error, setError] = useState(null);

  // bootstrap: if local token exists, attempt to fetch /me
  const bootstrap = useCallback(async () => {
    try {
      setReady(false);
      authApi.bootstrapAuth(); // just logs, keeps parity with localStorage
      const localToken = authApi.getLocalAccessToken();

      if (!localToken) {
        // No access token in storage. We might still have a refresh cookie;
        // but we won't call refresh here proactively — let requests trigger it.
        setUser(null);
        setReady(true);
        return;
      }

      // Attempt to get user with current token
      const res = await authApi.getMe();
      setUser(res?.user ?? null);
    } catch (err) {
      // If token invalid, authApi response interceptor will try refresh when needed.
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // register
  const register = async ({ name, email, password, role = 'student' }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name, email, password, role });
      // backend returns accessToken and sets refresh cookie
      // store user info if provided
      if (res?.user) setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res?.user) setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      setError(err);
      // still clear local state because cookie-clearing might have succeeded
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // manual refresh + re-fetch user (rarely needed; interceptor handles most)
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.refreshToken();
      if (res?.accessToken) {
        // optionally re-fetch user
        const me = await authApi.getMe();
        setUser(me?.user ?? null);
      }
      return res;
    } catch (err) {
      setUser(null);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    ready,
    loading,
    error,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    refresh,
    setUser // exported for rare manual fiddling (tests, admin flows)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
};
