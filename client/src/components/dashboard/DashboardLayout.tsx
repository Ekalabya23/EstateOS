import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { useSocket } from "../../lib/socket";

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useSocket(); // Initialize socket connection

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)]">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col min-h-screen bg-[var(--color-warm-white)] lg:ml-auto w-full lg:w-auto"
        style={{ marginLeft: window.innerWidth >= 1024 ? undefined : 0 }}
      >
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
