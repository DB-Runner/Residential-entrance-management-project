import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { useEffect, useState } from 'react';
import { authService } from './services/authService';

export default function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // При зареждане на приложението проверяваме дали има активна сесия (cookie)
    const checkAuth = async () => {
      try {
        // Опит да вземем текущия user от backend
        // Ако има валиден cookie (session или remember-me), backend ще върне user данни
        await authService.me();
        console.log('User authenticated via cookie');
      } catch (error) {
        console.log('No valid session found');
        // Няма валидна сесия - нормално
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Показваме loading screen докато проверяваме сесията
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Публични страници */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          } 
        />
        
        {/* Защитени страници - Жители Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard/overview" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/:view" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Защитени страници - Админ Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Navigate to="/admin/dashboard/overview" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard/:view" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Пренасочване за непознати пътища */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}