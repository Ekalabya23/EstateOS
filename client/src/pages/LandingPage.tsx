import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import PropertyShowcase from "@/components/landing/PropertyShowcase";
import AnalyticsPreview from "@/components/landing/AnalyticsPreview";
import AIInsights from "@/components/landing/AIInsights";
import ManagementEcosystem from "@/components/landing/ManagementEcosystem";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <>
      <Header />
      {/* Offset for fixed header */}
      <main className="pt-[88px] sm:pt-[88px]">
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
