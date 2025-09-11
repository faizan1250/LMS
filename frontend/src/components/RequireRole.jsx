import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireRole = ({ allowed = [], children }) => {
  const { isAuthenticated, user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role;
  if (!allowed.includes(role)) {
    // Option: redirect to a 403 page or home
    return <Navigate to="/403" replace />;
  }

  return children;
};
