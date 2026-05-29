import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Settings,
  Command,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/properties': 'Properties',
  '/dashboard/properties/new': 'Add Property',
  '/dashboard/tenants': 'Tenants',
  '/dashboard/financials': 'Financials',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/ai': 'AI Insights',
  '/dashboard/settings': 'Settings',
};

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((_, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: breadcrumbMap[path] || pathSegments[index], path };
  });

  return (
    <header className="h-14 bg-white/70 backdrop-blur-xl border-b border-[var(--color-mist)]/80 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[13px]">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--color-stone-light)]" />}
            <span
              className={`${
                i === breadcrumbs.length - 1
                  ? 'text-[var(--color-charcoal)] font-medium'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)] cursor-pointer transition-colors'
              }`}
              onClick={() => i < breadcrumbs.length - 1 && navigate(crumb.path)}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-warm-white)] border border-[var(--color-mist)] text-[var(--color-stone)] hover:border-[var(--color-stone-light)] transition-colors text-[13px]">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[var(--color-mist)] text-[9px] font-mono text-[var(--color-stone-light)] ml-2">
            <Command className="w-2 h-2" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--color-warm-white)] transition-colors text-[var(--color-stone)] hover:text-[var(--color-charcoal)]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-champagne)] rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--color-mist)] mx-1" />

        {/* User */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-[var(--color-warm-white)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-champagne-dark)] flex items-center justify-center text-white text-[10px] font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-[13px] font-medium text-[var(--color-charcoal)]">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] overflow-hidden py-1"
              >
                <div className="px-3.5 py-2.5 border-b border-[var(--color-mist)]">
                  <p className="text-[13px] font-medium text-[var(--color-charcoal)] leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-[var(--color-stone)] mt-0.5 truncate">{user?.email}</p>
                </div>
                <div className="py-0.5">
                  <button
                    onClick={() => { navigate('/dashboard/settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[var(--color-stone)]" />
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate('/dashboard/settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-[var(--color-stone)]" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-[var(--color-mist)] py-0.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
