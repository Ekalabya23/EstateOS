import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Intelligence", href: "#analytics" },
  { label: "Portfolio", href: "#portfolio" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "py-4" : "py-6"
      }`}
      style={{ height: isScrolled ? 72 : 88 }}
    >
      <div className="container-cinematic flex justify-center">
        {/* Floating Pill Navbar */}
        <div
          className={`relative flex items-center justify-between w-full max-w-7xl transition-all duration-700 rounded-full px-6 py-3 ${
            isScrolled
              ? "glass-premium shadow-[var(--shadow-editorial)] bg-white/70"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 z-10 group">
            <div className="w-9 h-9 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-[var(--ease-fluid)]">
              <span className="text-white text-sm font-semibold tracking-widest">
                E
              </span>
            </div>
            <span
              className="text-xl font-medium tracking-tight text-[var(--color-charcoal)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estate<span className="font-light italic">OS</span>
            </span>
          </a>

          {/* Desktop Links */}
          <nav
            className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
            onMouseLeave={() => setActiveItem(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setActiveItem(link.label)}
                className="relative px-5 py-2 text-sm text-[var(--color-charcoal)] font-[var(--font-body)] tracking-wide transition-colors z-10"
              >
                {link.label}
                {activeItem === link.label && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-black/5 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 z-10">
            <a
              href="/login"
              className="text-sm font-medium text-[var(--color-stone)] hover:text-[var(--color-charcoal)] transition-colors"
            >
              Log in
            </a>
            <a
              href="/register"
              className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] text-white text-sm font-medium rounded-full hover:bg-[var(--color-champagne-dark)] transition-colors duration-500"
            >
              Request Access
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden z-10 p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 mx-4 glass-premium rounded-3xl p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xl font-[var(--font-display)] py-2 border-b border-black/5"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
