import { DashboardHeader } from './DashboardHeader';
import { Sidebar } from './Sidebar';
import { PaymentsPanel } from './PaymentsPanel';
import { PaymentsPage } from './PaymentsPage';
import { EventsPanel } from './EventsPanel';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardView, dashboardViews } from '../types/views';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { view } = useParams<{ view: string }>();
  const navigate = useNavigate();
  const currentView = (view as DashboardView) || 'overview';

  // Validate view parameter
  useEffect(() => {
    if (view && !dashboardViews.includes(view as DashboardView)) {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [view, navigate]);

  const handleViewChange = (newView: DashboardView) => {
    navigate(`/dashboard/${newView}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        
        <main className="flex-1 p-6 ml-64">
          {currentView === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-gray-900">Преглед</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentsPanel />
                <EventsPanel />
              </div>
            </div>
          )}
          
          {currentView === 'payments' && <PaymentsPage />}
          
          {currentView === 'events' && (
            <div>
              <h1 className="text-gray-900 mb-6">Събития</h1>
              <EventsPanel expanded />
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