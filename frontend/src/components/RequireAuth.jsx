import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// RequireAuth protects routes that only logged-in users should see
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  // While we don't know auth status yet, render nothing or a spinner
  if (!ready) return null; // or a spinner component

  if (!isAuthenticated) {
    // send user to login, preserve attempted location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
