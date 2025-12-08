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

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== DBUserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
