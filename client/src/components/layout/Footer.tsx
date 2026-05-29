import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Properties', href: '#' },
    { label: 'Dashboard', href: '#' },
    { label: 'Analytics', href: '#' },
    { label: 'AI Insights', href: '#' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--color-charcoal)] text-white">
      {/* CTA Section */}
      <div className="container-wide py-20 md:py-28 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl text-white font-light"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to transform your{' '}
              <span className="italic">real estate</span> experience?
            </motion.h2>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-3 px-8 py-4 bg-[var(--color-champagne)] text-[var(--color-charcoal)] rounded-full text-sm tracking-wide uppercase font-medium hover:bg-[var(--color-champagne-light)] transition-colors duration-300 font-[var(--font-body)]"
          >
            <span>Get Started Free</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>

      {/* Links Grid */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-champagne)] flex items-center justify-center">
                <span className="text-[var(--color-charcoal)] text-xs font-semibold">E</span>
              </div>
              <span className="text-lg font-medium tracking-tight font-[var(--font-body)]">
                Estate<span className="font-light">OS</span>
              </span>
            </a>
            <p className="text-sm text-white/50 leading-relaxed mb-6 font-[var(--font-body)]">
              The future of luxury real estate management. Modern, intelligent, premium.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <a href="#" className="flex items-center gap-2 hover:text-[var(--color-champagne)] transition-colors font-[var(--font-body)]">
                <MapPin className="w-3.5 h-3.5" />
                Mumbai, India
              </a>
              <a href="mailto:hello@estateos.com" className="flex items-center gap-2 hover:text-[var(--color-champagne)] transition-colors font-[var(--font-body)]">
                <Mail className="w-3.5 h-3.5" />
                hello@estateos.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-[var(--color-champagne)] transition-colors font-[var(--font-body)]">
                <Phone className="w-3.5 h-3.5" />
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4 font-[var(--font-body)] font-medium">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[var(--color-champagne)] transition-colors duration-200 font-[var(--font-body)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-wide py-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-[var(--font-body)]">
            © {new Date().getFullYear()} EstateOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-white/30 hover:text-[var(--color-champagne)] transition-colors font-[var(--font-body)]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
