import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import PropertyShowcase from "@/components/landing/PropertyShowcase";
import AnalyticsPreview from "@/components/landing/AnalyticsPreview";
import AIInsights from "@/components/landing/AIInsights";
import ManagementEcosystem from "@/components/landing/ManagementEcosystem";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'tenant') {
        navigate('/dashboard/tenant');
      } else if (user.role === 'user') {
        navigate('/dashboard/investor');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  if (user) return null; // Prevent flash of landing page before redirect

  return (
    <>
      <Header />
      <main>
        <Hero />
        <PropertyShowcase />
        <AnalyticsPreview />
        <AIInsights />
        <ManagementEcosystem />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
