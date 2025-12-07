import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';

export default function App() {
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
        
        {/* Защитени страници */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
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