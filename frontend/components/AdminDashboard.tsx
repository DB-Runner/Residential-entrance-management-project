import { DashboardHeader } from './DashboardHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { ApartmentsManagement } from './ApartmentsManagement';
import { PaymentsManagement } from './PaymentsManagement';
import { EventsManagement } from './EventsManagement';
import { BuildingRegistrationModal } from './BuildingRegistrationModal';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingService } from '../services/buildingService';
import { AdminView, adminViews } from '../types/views';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { view } = useParams<{ view: string }>();
  const navigate = useNavigate();
  const currentView = (view as AdminView) || 'overview';
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [checkingBuilding, setCheckingBuilding] = useState(true);
  const [newBuildingCode, setNewBuildingCode] = useState<string | null>(null);

  // Validate view parameter
  useEffect(() => {
    if (view && !adminViews.includes(view as AdminView)) {
      navigate('/admin/dashboard/overview', { replace: true });
    }
  }, [view, navigate]);

  const handleViewChange = (newView: AdminView) => {
    navigate(`/admin/dashboard/${newView}`);
  };

  useEffect(() => {
    checkForNewBuildingCode();
  }, []);

  const checkBuildingStatus = async () => {
    try {
      const hasBuilding = await buildingService.hasBuilding();
      // Само показваме модала ако няма сграда И няма нов код
      if (!hasBuilding && !newBuildingCode) {
        setShowBuildingModal(true);
      }
    } catch (err) {
      console.error('Error checking building status:', err);
    } finally {
      setCheckingBuilding(false);
    }
  };

  const checkForNewBuildingCode = async () => {
    const code = localStorage.getItem('newBuildingCode');
    if (code) {
      setNewBuildingCode(code);
      setShowBuildingModal(true);
      setCheckingBuilding(false);
      // Премахни кода от localStorage след като го прочетем
      localStorage.removeItem('newBuildingCode');
    } else {
      // Само ако няма нов код, проверяваме статуса на сградата
      await checkBuildingStatus();
    }
  };

  const handleBuildingRegistrationComplete = (code: string) => {
    console.log('Building registered with code:', code);
    // Запази кода в localStorage за бъдещи проверки
    localStorage.setItem('buildingCode', code);
    setShowBuildingModal(false);
    setNewBuildingCode(null);
    
    // Изпрати custom event за да се актуализира ApartmentsManagement компонента
    window.dispatchEvent(new CustomEvent('buildingCodeUpdated', { detail: { code } }));
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
        <AdminSidebar currentView={currentView} onViewChange={handleViewChange} />
        
        <main className="flex-1 p-6 ml-64">
          {currentView === 'overview' && <AdminOverview />}
          {currentView === 'apartments' && <ApartmentsManagement />}
          {currentView === 'payments' && <PaymentsManagement />}
          {currentView === 'events' && <EventsManagement />}
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
        <BuildingRegistrationModal 
          onComplete={handleBuildingRegistrationComplete}
          existingCode={newBuildingCode}
        />
      )}
    </div>
  );
}