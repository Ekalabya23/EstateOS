import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  
  Bell,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Settings,
  
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import OmniSearch from '../shared/OmniSearch';
import api from '../../lib/axios';

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

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const handleNotification = () => {
      setHasNewNotification(true);
      fetchNotifications();
    };
    window.addEventListener('estateos-notification', handleNotification);
    return () => window.removeEventListener('estateos-notification', handleNotification);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications?limit=5');
      setNotifications(data.data);
      if (data.unreadCount > 0) setHasNewNotification(true);
    } catch (error) {
      console.error(error);
    }
  };

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
    <header className="h-14 bg-white/70 backdrop-blur-xl border-b border-[var(--color-mist)]/80 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30">
      {/* Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[var(--color-stone)] hover:bg-[var(--color-warm-white)] rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="flex items-center gap-1.5 text-[13px] hidden sm:flex">
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
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <OmniSearch />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setHasNewNotification(false);
            }}
            className="relative p-2 rounded-lg hover:bg-[var(--color-warm-white)] transition-colors text-[var(--color-stone)] hover:text-[var(--color-charcoal)]"
          >
            <Bell className="w-4 h-4" />
            {hasNewNotification && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-champagne)] rounded-full animate-pulse" />
            )}
          </button>
          
          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] overflow-hidden flex flex-col"
              >
                <div className="px-4 py-3 border-b border-[var(--color-mist)] flex justify-between items-center">
                  <h3 className="text-[13px] font-bold text-[var(--color-charcoal)]">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[12px] text-[var(--color-stone)]">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className={`p-3 border-b border-[var(--color-mist)] last:border-0 ${!n.read ? 'bg-[var(--color-warm-white)]' : ''}`}>
                        <p className="text-[12px] font-semibold text-[var(--color-charcoal)] truncate">{n.title}</p>
                        <p className="text-[11px] text-[var(--color-stone)] truncate">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-[var(--color-mist)] p-2">
                  <button
                    onClick={() => { navigate('/dashboard/notifications'); setShowNotifMenu(false); }}
                    className="w-full py-2 text-[12px] font-bold text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] rounded-lg transition-colors text-center uppercase tracking-widest"
                  >
                    View All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
