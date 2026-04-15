import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const roleRoutes = {
      customer: '/customer',
      owner: '/owner',
      chef: '/chef',
      reception: '/reception',
    };
    return <Navigate to={roleRoutes[role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
