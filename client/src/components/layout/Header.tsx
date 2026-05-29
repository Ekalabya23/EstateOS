import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Intelligence', href: '#analytics' },
  { label: 'Portfolio', href: '#portfolio' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`container-cinematic transition-all duration-500 ${isScrolled ? 'pt-4' : 'pt-6'}`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            isScrolled
              ? 'glass-premium shadow-[var(--shadow-editorial)] backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group z-10">
            <div className="w-9 h-9 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <span className="text-white text-sm font-semibold tracking-widest">E</span>
            </div>
            <span
              className="text-xl font-medium tracking-tight text-[var(--color-charcoal)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Estate<span className="font-light italic">OS</span>
            </span>
          </a>

          {/* Center nav */}
          <nav
            className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
            onMouseLeave={() => setActiveItem(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setActiveItem(link.label)}
                className="relative px-5 py-2 text-[13px] font-medium text-[var(--color-charcoal)] tracking-wide z-10"
              >
                {link.label}
                {activeItem === link.label && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-black/5 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-5 z-10">
            <a
              href="/login"
              className="text-[13px] font-medium text-[var(--color-stone)] hover:text-[var(--color-charcoal)] transition-colors duration-300"
            >
              Log in
            </a>
            <a
              href="/register"
              className="group flex items-center gap-2 px-5 py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-full hover:bg-[var(--color-champagne-dark)] transition-colors duration-400"
            >
              Request Access
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden z-10 p-2 -mr-1"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-[var(--color-charcoal)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--color-charcoal)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-4 mt-2 glass-premium rounded-2xl p-6 flex flex-col gap-1 md:hidden shadow-[var(--shadow-editorial)]"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-lg font-[var(--font-display)] py-3 border-b border-black/5 last:border-0 text-[var(--color-charcoal)]"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <a
                href="/login"
                className="text-center text-[13px] font-medium text-[var(--color-stone)] py-2"
              >
                Log in
              </a>
              <a
                href="/register"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-full"
              >
                Request Access
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
