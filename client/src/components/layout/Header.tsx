import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Residences", href: "#portfolio" },
  { label: "Intelligence", href: "#analytics" },
  { label: "Platform", href: "#platform" },
  { label: "Browse Properties", href: "/properties" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: "Residences", href: "/#portfolio" },
        { label: "Intelligence", href: "/#analytics" },
        { label: "Platform", href: "/#platform" },
        { label: "Browse Properties", href: "/properties" },
      ];
    }
    if (user.role === 'tenant') {
      return [
        { label: "My Lease", href: "/dashboard/tenant" },
        { label: "Maintenance", href: "/dashboard/maintenance" },
        { label: "Browse Properties", href: "/properties" },
      ];
    }
    if (user.role === 'user') { // Investor
      return [
        { label: "Portfolio", href: "/dashboard/investor" },
        { label: "Browse Properties", href: "/properties" },
      ];
    }
    // Admin / Landlord
    return [
      { label: "Command Center", href: "/dashboard" },
      { label: "Properties", href: "/dashboard/properties" },
      { label: "Tenants", href: "/dashboard/tenants" },
    ];
  };

  const currentNavLinks = getNavLinks();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-cinematic pt-4">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-5 rounded-2xl border px-4 py-3 transition-all duration-300 ${
            isScrolled
              ? "border-white/16 bg-[var(--color-charcoal)]/86 text-white shadow-[0_18px_60px_rgb(0_0_0/0.18)] backdrop-blur-xl"
              : "border-white/18 bg-[var(--color-charcoal)]/42 text-white backdrop-blur-xl"
          }`}
        >
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-[var(--color-charcoal)]">
              E
            </span>
            <span className="font-[var(--font-display)] text-xl font-extrabold tracking-normal">
              Estate<span className="text-[var(--color-champagne)]">OS</span>
            </span>
          </a>

          <nav className="hidden items-center justify-center gap-1 md:flex">
            {currentNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white/78 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-3 md:flex">
            {user ? (
              <>
                <button
                  onClick={() => navigate(user.role === 'tenant' ? '/dashboard/tenant' : user.role === 'user' ? '/dashboard/investor' : '/dashboard')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-charcoal)] transition-transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white/68 transition-colors hover:bg-white/10 hover:text-white"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-sm font-semibold text-white/68 transition-colors hover:text-white">
                  Log in
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-charcoal)] transition-transform hover:-translate-y-0.5"
                >
                  Request Access
                  <ArrowRight className="h-4 w-4" />
                </a>
              </>
            )}
          </div>

          <button
            className="justify-self-end rounded-xl p-2 text-white md:hidden"
            onClick={() => setIsMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-2 rounded-2xl border border-white/12 bg-[var(--color-charcoal)]/94 p-4 text-white shadow-[0_20px_80px_rgb(0_0_0/0.28)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {currentNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-white/76 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {user ? (
                <>
                  <button onClick={() => navigate(user.role === 'tenant' ? '/dashboard/tenant' : user.role === 'user' ? '/dashboard/investor' : '/dashboard')} className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[var(--color-charcoal)]">
                    Dashboard
                  </button>
                  <button onClick={() => { logout(); navigate('/'); setIsMobileOpen(false); }} className="rounded-xl border border-white/12 px-4 py-3 text-center text-sm font-bold flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="rounded-xl border border-white/12 px-4 py-3 text-center text-sm font-bold">
                    Log in
                  </a>
                  <a href="/register" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[var(--color-charcoal)]">
                    Access
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
