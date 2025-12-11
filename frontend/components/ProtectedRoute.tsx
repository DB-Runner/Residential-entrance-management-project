import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole as DBUserRole } from '../types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    user,
    requireAdmin,
    localStorage: {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      currentUser: localStorage.getItem('currentUser'),
    }
  });

  if (!isAuthenticated || !user) {
    console.log('User not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== DBUserRole.ADMIN) {
    console.log('User is not admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
}