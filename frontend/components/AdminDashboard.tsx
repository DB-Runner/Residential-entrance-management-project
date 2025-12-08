import { DashboardHeader } from './DashboardHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { ResidentsManagement } from './ResidentsManagement';
import { PaymentsManagement } from './PaymentsManagement';
import { EventsManagement } from './EventsManagement';
import { AnnouncementsManagement } from './AnnouncementsManagement';
import { BuildingRegistrationModal } from './BuildingRegistrationModal';
import { useState, useEffect } from 'react';
import { buildingService } from '../services/buildingService';
import { AdminView } from '../types/views';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [checkingBuilding, setCheckingBuilding] = useState(true);

  useEffect(() => {
    checkBuildingStatus();
  }, []);

  const checkBuildingStatus = async () => {
    try {
      const hasBuilding = await buildingService.hasBuilding();
      setShowBuildingModal(!hasBuilding);
    } catch (err) {
      console.error('Error checking building status:', err);
    } finally {
      setCheckingBuilding(false);
    }
  };

  const handleBuildingRegistrationComplete = (code: string) => {
    console.log('Building registered with code:', code);
    setShowBuildingModal(false);
  };

  if (checkingBuilding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Зареждане...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} isAdmin />
      
      <div className="flex">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 p-6">
          {currentView === 'overview' && <AdminOverview />}
          {currentView === 'residents' && <ResidentsManagement />}
          {currentView === 'payments' && <PaymentsManagement />}
          {currentView === 'events' && <EventsManagement />}
          {/*currentView === 'announcements' && <AnnouncementsManagement />*/}
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

      {/* Building Registration Modal */}
      {showBuildingModal && (
        <BuildingRegistrationModal onComplete={handleBuildingRegistrationComplete} />
      )}
    </div>
  );
}