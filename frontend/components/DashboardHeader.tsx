import { Building2, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  onLogout: () => void;
  isAdmin?: boolean;
}

export function DashboardHeader({ onLogout, isAdmin = false }: DashboardHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Лого */}
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <span className="text-blue-600 block"><b>SmartEntrance</b></span>
            <span className="text-gray-500 text-sm">
              {isAdmin ? 'Панел за управление' : 'бул. Витоша 10, вх. А'}
            </span>
          </div>
        </div>
        
        {/* Профил отдясно */}
        <div className="flex items-center gap-4">
          {/* Известия */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Профилно меню */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-gray-900">
                  {isAdmin ? 'Елена Димитрова' : 'Иван Иванов'}
                </div>
                <div className="text-gray-500 text-sm">
                  {isAdmin ? 'Домоуправител' : 'Ап. 12'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Dropdown меню */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                  <User className="w-4 h-4" />
                  Моят профил
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Изход
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}