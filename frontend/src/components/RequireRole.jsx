// components/RequireRole.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireRole = ({ allowed = [], children }) => {
  const { isAuthenticated, user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null; // or a loader

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role;
  if (!allowed.includes(role)) return <Navigate to="/403" replace />;

  // Support both element children and render-prop children
  return typeof children === 'function' ? children(user) : children;
};
