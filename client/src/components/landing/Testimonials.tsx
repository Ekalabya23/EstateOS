import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "EstateOS didn't just digitize our workflows; it elevated our entire brand. The interface is a masterclass in luxury product design.",
    name: "Eleanor Sterling",
    role: "Managing Director",
    company: "Sterling Realty",
  },
  {
    id: 2,
    quote: "We replaced six legacy platforms with this single operating system. The AI contract analysis alone saves our legal team 40 hours a week.",
    name: "Julian Vance",
    role: "CEO",
    company: "Vance & Co Properties",
  },
  {
    id: 3,
    quote: "Our ultra-high-net-worth clients expect an Apple-level experience. EstateOS is the only platform that delivers that level of cinematic quality.",
    name: "Sophia Chen",
    role: "Principal Broker",
    company: "Azure Group",
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

  return (
    <section ref={containerRef} className="section-dense relative overflow-hidden bg-[var(--color-charcoal)] border-t border-white/10">
      
      {/* Background Noise & Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 architectural-grid-dark" />
      </div>

      <div className="container-cinematic relative z-10">
        
        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <Quote className="w-12 h-12 text-[var(--color-champagne)] mx-auto mb-8 opacity-50" />
          <h2 className="heading-section text-white max-w-4xl mx-auto leading-tight">
            "The first real estate platform that feels like it was designed in <span className="italic font-light text-[var(--color-champagne)]">Cupertino.</span>"
          </h2>
          <p className="mt-8 text-white/50 text-sm tracking-widest uppercase font-semibold">
            — Wired Magazine
          </p>
        </motion.div>

        {/* Scrolling Cards */}
        <div className="grid-12 relative">
          
          {/* Subtle gradient behind cards */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-champagne)]/5 via-transparent to-[var(--color-champagne)]/5 blur-3xl pointer-events-none" />

          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 md:col-span-4 glass-premium-dark p-10 rounded-[2rem] flex flex-col justify-between group hover:border-[var(--color-champagne)]/50 transition-colors duration-700"
            >
              <p className="text-body-elegant text-white/80 mb-12 italic leading-relaxed">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6 group-hover:border-[var(--color-champagne)]/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white font-[var(--font-display)] text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{t.name}</h4>
                  <p className="text-white/50 text-xs font-mono">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Massive Background Text for Depth */}
      <motion.div 
        style={{ x: x1 }}
        className="absolute top-1/4 -left-[20%] text-[15vw] font-[var(--font-display)] font-bold text-white/5 whitespace-nowrap pointer-events-none select-none"
      >
        TRUSTED BY LEADERS
      </motion.div>
    </section>
  );
}
