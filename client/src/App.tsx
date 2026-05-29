import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { useAuthStore } from '@/store/useAuthStore';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Dashboard
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/Dashboard';
import Properties from '@/pages/dashboard/Properties';
import AddProperty from '@/pages/dashboard/AddProperty';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  useLenis();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/properties" element={<Properties />} />
          <Route path="/dashboard/properties/new" element={<AddProperty />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
