import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole as DBUserRole } from '../types/database';

interface AuthRedirectProps {
  children: React.ReactNode;
}

// Пренасочва вече влезли потребители към техния dashboard
export function AuthRedirect({ children }: AuthRedirectProps) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (isAuthenticated && user) {
    if (user.role === DBUserRole.BUILDING_MANAGER) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}