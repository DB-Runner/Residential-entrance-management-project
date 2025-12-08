import { DashboardHeader } from './DashboardHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { ResidentsManagement } from './ResidentsManagement';
import { PaymentsManagement } from './PaymentsManagement';
import { EventsManagement } from './EventsManagement';
import { AnnouncementsManagement } from './AnnouncementsManagement';
import { useState } from 'react';

type AdminView = 'overview' | 'residents' | 'payments' | 'events' | 'announcements' | 'reports';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} isAdmin />
      
      <div className="flex">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 p-6 ml-64">
          {currentView === 'overview' && <AdminOverview />}
          {currentView === 'residents' && <ResidentsManagement />}
          {currentView === 'payments' && <PaymentsManagement />}
          {currentView === 'events' && <EventsManagement />}
          {currentView === 'announcements' && <AnnouncementsManagement />}
          {currentView === 'reports' && (
            <div>
              <h1 className="text-gray-900 mb-6">Отчети</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Месечни и годишни отчети</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
