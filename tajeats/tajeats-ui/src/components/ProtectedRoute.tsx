import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'restaurant' | 'customer' | 'rider';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated - redirect to appropriate login page
  if (!isAuthenticated) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else if (requiredRole === 'restaurant') {
      return <Navigate to="/restaurant/login" replace />;
    } else if (requiredRole === 'rider') {
      return <Navigate to="/rider/login" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Authenticated but wrong role
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirect to their own dashboard or home
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'restaurant') {
      return <Navigate to="/restaurant/dashboard" replace />;
    } else if (user.role === 'rider') {
      return <Navigate to="/rider/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Check if restaurant owner is approved
  if (user && user.role === 'restaurant' && !user.isApproved) {
    return <Navigate to="/restaurant/login" replace />;
  }

  // Authenticated and authorized
  return <>{children}</>;
};
