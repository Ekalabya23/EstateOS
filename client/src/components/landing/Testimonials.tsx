import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "EstateOS didn't just digitize our workflows; it elevated our entire brand. The interface is a masterclass in luxury product design.",
    name: 'Eleanor Sterling',
    role: 'Managing Director',
    company: 'Sterling Realty',
  },
  {
    id: 2,
    quote:
      'We replaced six legacy platforms with this single operating system. The AI contract analysis alone saves our legal team 40 hours a week.',
    name: 'Julian Vance',
    role: 'CEO',
    company: 'Vance & Co Properties',
  },
  {
    id: 3,
    quote:
      'Our ultra-high-net-worth clients expect an Apple-level experience. EstateOS is the only platform that delivers that level of cinematic quality.',
    name: 'Sophia Chen',
    role: 'Principal Broker',
    company: 'Azure Group',
  },
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const xBg = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section
      ref={containerRef}
      className="section-dense relative overflow-hidden bg-[var(--color-charcoal)] border-t border-white/8"
    >
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="absolute inset-0 architectural-grid-dark" />
      </div>

      <div className="container-cinematic relative z-10">

        {/* ── Hero quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <Quote className="w-10 h-10 text-[var(--color-champagne)] mx-auto mb-8 opacity-40" />
          <h2 className="heading-section text-white max-w-4xl mx-auto leading-[1.05]">
            "The first real estate platform that feels like it was designed in{' '}
            <span className="italic font-light text-[var(--color-champagne)]">Cupertino.</span>"
          </h2>
          <p className="mt-6 text-white/40 text-[11px] tracking-[0.2em] uppercase font-semibold">
            — Wired Magazine
          </p>
        </motion.div>

        {/* ── Testimonial cards ── */}
        <div className="grid-12 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 md:col-span-4 glass-premium-dark rounded-[1.75rem] p-8 flex flex-col justify-between gap-8 group hover:border-[var(--color-champagne)]/30 transition-colors duration-700 min-h-[280px]"
            >
              {/* Quote text */}
              <p className="text-white/70 text-base leading-relaxed italic flex-1">
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/8 group-hover:border-[var(--color-champagne)]/20 transition-colors duration-500">
                <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white font-[var(--font-display)] text-base shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm leading-tight">{t.name}</h4>
                  <p className="text-white/40 text-[11px] font-mono mt-0.5">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Background decorative text */}
      <motion.div
        style={{ x: xBg }}
        className="absolute bottom-8 -left-[10%] text-[12vw] font-[var(--font-display)] font-bold text-white/[0.04] whitespace-nowrap pointer-events-none select-none"
      >
        TRUSTED BY LEADERS
      </motion.div>
    </section>
  );
}
