import { LayoutDashboard, Receipt, Calendar, /*MessageSquare,*/ User } from 'lucide-react';
import { DashboardView } from '../types/views';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const menuItems = [
  { id: 'overview' as DashboardView, label: 'Преглед', icon: LayoutDashboard },
  { id: 'payments' as DashboardView, label: 'Плащания', icon: Receipt },
  { id: 'events' as DashboardView, label: 'Събития', icon: Calendar },
  /*{id: 'messages' as DashboardView, label: 'Съобщения', icon: MessageSquare},*/
  { id: 'profile' as DashboardView, label: 'Профил', icon: User },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r sticky top-[73px] h-[calc(100vh-73px)] self-start">
      <nav className="p-4">
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
