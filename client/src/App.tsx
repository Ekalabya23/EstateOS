import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { useAuthStore } from '@/store/useAuthStore';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import PropertyListing from '@/pages/public/PropertyListing';
import PropertyDetail from '@/pages/public/PropertyDetail';

// Dashboard
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/Dashboard';
import Properties from '@/pages/dashboard/Properties';
import AddProperty from '@/pages/dashboard/AddProperty';
import Tenants from '@/pages/dashboard/Tenants';
import AddTenant from '@/pages/dashboard/AddTenant';
import Financials from '@/pages/dashboard/Financials';
import AddTransaction from '@/pages/dashboard/AddTransaction';
import Analytics from '@/pages/dashboard/Analytics';
import AIInsights from '@/pages/dashboard/AIInsights';
import Messages from '@/pages/dashboard/Messages';
import Settings from '@/pages/dashboard/Settings';
import TenantDashboard from '@/pages/dashboard/TenantDashboard';
import InvestorDashboard from '@/pages/dashboard/InvestorDashboard';
import Maintenance from '@/pages/dashboard/Maintenance';
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
      <Route path="/properties" element={<PropertyListing />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      
      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/tenant" element={<TenantDashboard />} />
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
          <Route path="/dashboard/maintenance" element={<Maintenance />} />
          <Route path="/dashboard/properties" element={<Properties />} />
          <Route path="/dashboard/properties/new" element={<AddProperty />} />
          <Route path="/dashboard/tenants" element={<Tenants />} />
          <Route path="/dashboard/tenants/new" element={<AddTenant />} />
          <Route path="/dashboard/financials" element={<Financials />} />
          <Route path="/dashboard/financials/new" element={<AddTransaction />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/ai" element={<AIInsights />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
