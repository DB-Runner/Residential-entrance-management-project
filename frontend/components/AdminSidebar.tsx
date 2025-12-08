import { LayoutDashboard, Users, Receipt, Calendar, /*Megaphone,*/ FileText } from 'lucide-react';
import { AdminView } from '../types/views';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const menuItems = [
  { id: 'overview' as AdminView, label: 'Преглед', icon: LayoutDashboard },
  { id: 'residents' as AdminView, label: 'Жители', icon: Users },
  { id: 'payments' as AdminView, label: 'Плащания', icon: Receipt },
  { id: 'events' as AdminView, label: 'Събития', icon: Calendar },
  /*{ id: 'announcements' as AdminView, label: 'Обяви', icon: Megaphone },*/
  { id: 'reports' as AdminView, label: 'Отчети', icon: FileText },
];

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
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
