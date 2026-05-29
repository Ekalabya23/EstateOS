import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Key, FileSignature, Globe2 } from 'lucide-react';

const features = [
  {
    label: 'Bank-Grade Infrastructure',
    desc: 'End-to-end encryption with SOC2 Type II compliance.',
    icon: Shield,
  },
  {
    label: 'Global Liquidity',
    desc: 'Multi-currency processing and international tax routing.',
    icon: Globe2,
  },
  {
    label: 'Digital Custody',
    desc: 'Cryptographically verifiable lease and deed management.',
    icon: FileSignature,
  },
];

export default function ManagementEcosystem() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="section-dense bg-[var(--color-ivory)] border-t border-[var(--color-mist)] relative overflow-hidden"
    >
      {/* Diagonal background accent */}
      <div className="absolute right-0 top-0 w-[45%] h-full bg-[var(--color-warm-white)] -skew-x-12 translate-x-24 hidden lg:block pointer-events-none" />

      <div className="container-cinematic relative z-10">
        <div className="grid-12 items-center gap-y-16">

          {/* ── Left: narrative ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-8"
          >
            <div>
              <span className="text-[var(--color-champagne-dark)] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4 block">
                Full-Stack Control
              </span>
              <h2 className="heading-section leading-[1.05]">
                The Architecture of{' '}
                <br className="hidden lg:block" />
                <span className="italic font-light text-[var(--color-stone)]">Total Control.</span>
              </h2>
            </div>

            <p className="text-body-elegant max-w-md">
              EstateOS is not a disjointed suite of tools. It is a singular operating system
              designed to orchestrate the entire lifecycle of global real estate assets.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-6">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full border border-[var(--color-mist)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-charcoal)] transition-colors duration-500">
                    <item.icon className="w-4.5 h-4.5 text-[var(--color-charcoal)] group-hover:text-white transition-colors duration-500 w-[18px] h-[18px]" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[var(--color-charcoal)] font-semibold text-base mb-1 font-[var(--font-body)]">
                      {item.label}
                    </h4>
                    <p className="text-[var(--color-stone)] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-6 lg:col-start-7 relative"
          >
            {/* Aspect-ratio image container */}
            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[var(--shadow-editorial)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")',
                }}
              />
              <div className="absolute inset-0 bg-black/20 rounded-[2rem]" />

              {/* Access Granted card — top left, clear spacing */}
              <div className="absolute top-6 left-6 glass-premium rounded-2xl p-5 w-56 shadow-[var(--shadow-cinematic)]">
                <div className="flex items-center gap-2.5 mb-4">
                  <Key className="w-4 h-4 text-[var(--color-champagne-dark)] shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)]">
                    Access Granted
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-[var(--color-mist)] rounded-full" />
                  <div className="w-2/3 h-1.5 bg-[var(--color-mist)] rounded-full" />
                </div>
              </div>

              {/* System Status card — bottom right, clear spacing */}
              <div className="absolute bottom-6 right-6 glass-premium-dark rounded-2xl p-6 w-64 shadow-[var(--shadow-cinematic)]">
                <div className="text-white/45 text-[10px] font-mono uppercase tracking-widest mb-2">
                  System Status
                </div>
                <div className="text-white font-[var(--font-display)] text-xl leading-tight mb-5">
                  All Systems Operational
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-success)]" />
                  </span>
                  <span className="text-white/60 text-[12px] font-mono">0ms latency</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
