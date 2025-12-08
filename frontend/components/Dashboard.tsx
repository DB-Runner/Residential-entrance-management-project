import { DashboardHeader } from './DashboardHeader';
import { Sidebar } from './Sidebar';
import { PaymentsPanel } from './PaymentsPanel';
import { EventsPanel } from './EventsPanel';
import { MessagesPanel } from './MessagesPanel';
import { AnnouncementsPanel } from './AnnouncementsPanel';
import { useState } from 'react';

type DashboardView = 'overview' | 'payments' | 'events' | 'messages' | 'profile';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 p-6 ml-64">
          {currentView === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-gray-900">Преглед</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentsPanel />
                <AnnouncementsPanel />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventsPanel />
                <MessagesPanel />
              </div>
            </div>
          )}
          
          {currentView === 'payments' && (
            <div>
              <h1 className="text-gray-900 mb-6">Плащания</h1>
              <PaymentsPanel expanded />
            </div>
          )}
          
          {currentView === 'events' && (
            <div>
              <h1 className="text-gray-900 mb-6">Събития</h1>
              <EventsPanel expanded />
            </div>
          )}
          
          {currentView === 'messages' && (
            <div>
              <h1 className="text-gray-900 mb-6">Съобщения</h1>
              <MessagesPanel expanded />
            </div>
          )}
          
          {currentView === 'profile' && (
            <div>
              <h1 className="text-gray-900 mb-6">Моят профил</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Настройки на профила</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
