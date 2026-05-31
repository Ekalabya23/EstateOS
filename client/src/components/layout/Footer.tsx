import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

const links = [
  ["Residences", "#portfolio"],
  ["Intelligence", "#analytics"],
  ["Platform", "#platform"],
  ["Dashboard", "/dashboard"],
  ["Log in", "/login"],
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-charcoal-dark)] text-white">
      <div className="container-wide py-16 md:py-24">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="section-kicker text-[var(--color-champagne)]">EstateOS</p>
              <h2 className="mt-5 max-w-3xl font-[var(--font-display)] text-4xl font-extrabold leading-none md:text-6xl">
                Bring your premium portfolio into one private command center.
              </h2>
            </div>
            <a href="/register" className="btn-cinematic bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-champagne)]">
              Request Access
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-[var(--color-charcoal)]">
                E
              </span>
              <span className="font-[var(--font-display)] text-xl font-extrabold">
                Estate<span className="text-[var(--color-champagne)]">OS</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/48">
              Premium real estate operating software for private inventory, portfolio intelligence, and controlled deal rooms.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/34">Navigate</h3>
            <div className="mt-5 grid gap-3">
              {links.map(([label, href]) => (
                <a key={label} href={href} className="text-sm font-semibold text-white/58 transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/34">Contact</h3>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              <a href="#" className="flex items-center gap-2 hover:text-white">
                <MapPin className="h-4 w-4 text-[var(--color-champagne)]" />
                Mumbai, India
              </a>
              <a href="mailto:hello@estateos.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-[var(--color-champagne)]" />
                hello@estateos.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-[var(--color-champagne)]" />
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/34 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} EstateOS. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
