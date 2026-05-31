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
import LeaseSign from '@/pages/public/LeaseSign';
import VendorQuote from '@/pages/public/VendorQuote';
import Pricing from '@/pages/public/Pricing';
import About from '@/pages/public/About';
import Features from '@/pages/public/Features';
import Blog from '@/pages/public/Blog';
import PrivacyPolicy from '@/pages/public/legal/PrivacyPolicy';
import TermsOfService from '@/pages/public/legal/TermsOfService';
import NotFound from '@/pages/NotFound';
import CookieConsent from 'react-cookie-consent';

// Dashboard
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/Dashboard';
import Properties from '@/pages/dashboard/Properties';
import AddProperty from '@/pages/dashboard/AddProperty';
import Tenants from '@/pages/dashboard/Tenants';
import AddTenant from '@/pages/dashboard/AddTenant';
import Financials from '@/pages/dashboard/Financials';
import AddTransaction from '@/pages/dashboard/AddTransaction';
import PaymentHistory from '@/pages/dashboard/PaymentHistory';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
import SavedProperties from '@/pages/dashboard/SavedProperties';
import Analytics from '@/pages/dashboard/Analytics';
import AIInsights from '@/pages/dashboard/AIInsights';
import LeaseAnalyzer from '@/pages/dashboard/LeaseAnalyzer';
import LeaseGenerator from '@/pages/dashboard/LeaseGenerator';
import Onboarding from '@/pages/dashboard/Onboarding';
import PropertyInspection from '@/pages/dashboard/PropertyInspection';
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
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<PropertyListing />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/lease/:tenantId/sign" element={<LeaseSign />} />
        <Route path="/quote/:ticketId/:vendorId" element={<VendorQuote />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-of-service" element={<TermsOfService />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/onboarding" element={<Onboarding />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/tenant" element={<TenantDashboard />} />
            <Route path="/dashboard/investor" element={<InvestorDashboard />} />
            <Route path="/dashboard/maintenance" element={<Maintenance />} />
            <Route path="/dashboard/properties" element={<Properties />} />
            <Route path="/dashboard/properties/new" element={<AddProperty />} />
            <Route path="/dashboard/properties/inspections" element={<PropertyInspection />} />
            <Route path="/dashboard/tenants" element={<Tenants />} />
            <Route path="/dashboard/tenants/new" element={<AddTenant />} />
            <Route path="/dashboard/financials" element={<Financials />} />
            <Route path="/dashboard/financials/new" element={<AddTransaction />} />
            <Route path="/dashboard/payments" element={<PaymentHistory />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/ai" element={<AIInsights />} />
            <Route path="/dashboard/ai/lease-analyzer" element={<LeaseAnalyzer />} />
            <Route path="/dashboard/leases/new" element={<LeaseGenerator />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/saved" element={<SavedProperties />} />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="estateos-cookie-consent"
        style={{ background: "var(--color-charcoal)", color: "white", fontSize: "13px", fontFamily: "var(--font-sans)" }}
        buttonStyle={{ background: "var(--color-champagne-dark)", color: "white", fontSize: "13px", fontWeight: "bold", borderRadius: "8px", padding: "10px 20px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience and ensure GDPR compliance.
      </CookieConsent>
    </>
  );
}

export default App;
