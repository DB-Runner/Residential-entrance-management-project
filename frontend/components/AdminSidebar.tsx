import { LayoutDashboard, Users, Receipt, Calendar, Megaphone, FileText } from 'lucide-react';
import { AdminView } from '../types/views';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types/database';
import { useEffect, useState } from 'react';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const menuItems = [
  { id: 'overview' as AdminView, label: 'Преглед', icon: LayoutDashboard },
  { id: 'apartments' as AdminView, label: 'Апартаменти', icon: Users },
  { id: 'payments' as AdminView, label: 'Плащания', icon: Receipt },
  { id: 'events' as AdminView, label: 'Събития', icon: Calendar },
  { id: 'reports' as AdminView, label: 'Отчети', icon: FileText },
];

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Вземи ролята от localStorage
    const role = authService.getUserRole();
    setUserRole(role);
  }, []);

  const handleSwitchToResident = () => {
    navigate('/dashboard');
  };

  const isBuildingManager = userRole === UserRole.BUILDING_MANAGER;

  return (
    <aside className="w-64 bg-white border-r fixed left-0 top-[73px] bottom-0 overflow-y-auto">
      <nav className="p-6">
        {/* Slide Switch за превключване между панели */}
        {isBuildingManager && (
          <div className="mb-6 pb-6 border-b">
            <div className="text-xs text-gray-500 mb-3"> </div>
            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleSwitchToResident}
                className="flex-1 px-3 py-2 rounded-md text-sm transition-colors text-gray-600 hover:text-gray-900"
              >
                Жител
              </button>
              <button
                className="flex-1 px-0.5 py-2 rounded-md text-sm transition-colors bg-white text-blue-600 shadow-sm font-medium"
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