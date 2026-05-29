import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Properties', icon: Building2, path: '/dashboard/properties' },
  { label: 'Tenants', icon: Users, path: '/dashboard/tenants' },
  { label: 'Financials', icon: DollarSign, path: '/dashboard/financials' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { label: 'AI Insights', icon: Sparkles, path: '/dashboard/ai' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-[var(--color-mist)] overflow-hidden select-none"
    >
      {/* ── Logo Bar ── */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[var(--color-mist)] shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-charcoal)] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold tracking-widest">E</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-medium tracking-tight text-[var(--color-charcoal)] whitespace-nowrap overflow-hidden"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Estate<span className="font-light italic">OS</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-stone-light)] px-2.5 pt-1 pb-2.5"
            >
              Main Menu
            </motion.span>
          )}
        </AnimatePresence>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors duration-150 group ${
                collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-2.5 py-2'
              } ${
                isActive
                  ? 'text-[var(--color-charcoal)]'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-black/[0.03]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 bg-[var(--color-cream)] rounded-lg border border-[var(--color-mist)]/80"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] shrink-0 relative z-10 ${isActive ? 'text-[var(--color-champagne-dark)]' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

        {/* Separator */}
        <div className="my-3 mx-2 border-t border-[var(--color-mist)]" />

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-stone-light)] px-2.5 pt-1 pb-2.5"
            >
              System
            </motion.span>
          )}
        </AnimatePresence>

        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-2.5 py-2'
              } ${
                isActive
                  ? 'text-[var(--color-charcoal)] bg-[var(--color-cream)]'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-black/[0.03]'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.12 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={onToggle}
        className={`mx-2.5 mb-2 flex items-center gap-2 py-2 rounded-lg text-[var(--color-stone)] hover:bg-black/[0.03] hover:text-[var(--color-charcoal)] transition-colors ${
          collapsed ? 'justify-center' : 'px-2.5'
        }`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-medium"
            >
              Collapse
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── User Card ── */}
      <div className="border-t border-[var(--color-mist)] p-2.5">
        <div className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.03] transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-champagne-dark)] flex items-center justify-center shrink-0 text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-medium text-[var(--color-charcoal)] truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-stone-light)] leading-tight mt-0.5">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="p-1.5 rounded-md hover:bg-red-50 text-[var(--color-stone-light)] hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
