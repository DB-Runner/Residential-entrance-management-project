import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PaymentCheckoutPage } from './pages/PaymentCheckoutPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { useEffect, useState } from 'react';
import { authService } from './services/authService';

const libraries: ('places')[] = ['places'];

export default function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.me();
        console.log('User authenticated via cookie');
      } catch {
        console.log('No valid session found');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Auth loading
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

  // Google Maps loading (IMPORTANT)
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading Google Maps…</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Публични */}
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

        {/* Жители */}
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

        {/* Админ */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Navigate to="/admin/dashboard/overview" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/:view"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Плащане */}
        <Route
          path="/payment/checkout"
          element={
            <ProtectedRoute>
              <PaymentCheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
