import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check match
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to their default allowed route
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (role === 'STORE_OWNER') {
      return <Navigate to="/store-owner/dashboard" replace />;
    }
    return <Navigate to="/stores" replace />;
  }

  return children;
};
