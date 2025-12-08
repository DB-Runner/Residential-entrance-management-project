import { Dashboard } from '../components/Dashboard';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return <Dashboard onLogout={handleLogout} />;
}
