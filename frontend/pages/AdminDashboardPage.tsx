import { AdminDashboard } from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return <AdminDashboard onLogout={handleLogout} />;
}
