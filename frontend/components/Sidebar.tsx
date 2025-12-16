import { LayoutDashboard, Receipt, Calendar, User } from 'lucide-react';
import { DashboardView } from '../types/views';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types/database';
import { useEffect, useState } from 'react';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const menuItems = [
  { id: 'overview' as DashboardView, label: 'Преглед', icon: LayoutDashboard },
  { id: 'payments' as DashboardView, label: 'Плащания', icon: Receipt },
  { id: 'events' as DashboardView, label: 'Събития', icon: Calendar },
  { id: 'profile' as DashboardView, label: 'Профил', icon: User },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Вземи ролята от localStorage
    const role = authService.getUserRole();
    setUserRole(role);
  }, []);

  const handleSwitchToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const isBuildingManager = userRole === UserRole.BUILDING_MANAGER;

  return (
    <aside className="w-64 bg-white border-r fixed left-0 top-[80px] bottom-0 overflow-y-auto">
      <nav className="p-4">
        {/* Slide Switch за превключване между панели */}
        {isBuildingManager && (
          <div className="mb-6 pb-6 border-b">
            <div className="text-xs text-gray-500 mb-5"> </div>
            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                className="flex-1 px-3 py-2 rounded-md text-sm transition-colors bg-white text-blue-600 shadow-sm font-medium"
              >
                Жител
              </button>
              <button
                onClick={handleSwitchToAdmin}
                className="flex-1 px-3 py-2 rounded-md text-sm transition-colors text-gray-600 hover:text-gray-900"
              >
                Домоуправител
              </button>
            </div>
          </div>
        )}
        
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}