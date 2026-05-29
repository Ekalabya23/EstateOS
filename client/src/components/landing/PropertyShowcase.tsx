import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';

const properties = [
  {
    id: 1,
    title: 'The Azure Penthouse',
    location: 'Mumbai, India',
    price: '₹8.5 Cr',
    specs: '4 Bed · 3 Bath · 3,800 sqft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-8',
    height: 'h-[540px]',
  },
  {
    id: 2,
    title: 'Villa Serena',
    location: 'Goa, India',
    price: '₹4.2 Cr',
    specs: '5 Bed · 4 Bath · 4,200 sqft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-4',
    height: 'h-[540px]',
  },
  {
    id: 3,
    title: 'Emerald Gardens',
    location: 'Bangalore, India',
    price: '₹3.8 Cr',
    specs: '4 Bed · 3 Bath · 3,500 sqft',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-5',
    height: 'h-[460px]',
  },
  {
    id: 4,
    title: 'Ivory Residences',
    location: 'Delhi, India',
    price: '₹6.1 Cr',
    specs: '6 Bed · 5 Bath · 5,100 sqft',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-7',
    height: 'h-[460px]',
  },
];

export default function PropertyShowcase() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="section-dense relative overflow-hidden bg-[var(--color-charcoal)]"
    >
      {/* Subtle grid overlay */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-[0.035] pointer-events-none">
        <div className="absolute inset-0 architectural-grid-dark" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-charcoal-dark)] pointer-events-none" />

      <div className="container-cinematic relative z-10">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <span className="text-[var(--color-champagne)] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4 block">
              Exclusive Portfolio
            </span>
            <h2 className="heading-section text-white leading-[1.05]">
              Curated Spaces for the{' '}
              <span className="italic font-light text-white/60">Extraordinary.</span>
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 pb-2 border-b border-white/20 hover:border-white/50 self-end shrink-0"
          >
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium">View Archive</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* ── Property grid ── */}
        <div className="grid-12 gap-4">
          {properties.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`${prop.colSpan} ${prop.height} group relative rounded-[1.75rem] overflow-hidden cursor-pointer bg-[var(--color-charcoal-dark)]`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.8s] ease-[var(--ease-fluid)] group-hover:scale-[1.04]"
                style={{ backgroundImage: `url(${prop.image})` }}
              />

              {/* Gradient mask — stronger at bottom for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Champagne overlay on hover */}
              <div className="absolute inset-0 bg-[var(--color-champagne)]/15 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Border ring */}
              <div className="absolute inset-0 border border-white/8 rounded-[1.75rem] group-hover:border-[var(--color-champagne)]/40 transition-colors duration-700 z-20 pointer-events-none" />

              {/* Expand icon */}
              <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass-premium-dark flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[var(--ease-fluid)]">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>

              {/* Metadata — always at bottom, consistent 40px padding */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-16 z-20 bg-gradient-to-t from-black/60 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[var(--ease-fluid)]">
                {/* Location badge — slides up on hover */}
                <div className="overflow-hidden mb-2">
                  <span className="block text-[var(--color-champagne)] text-[11px] tracking-[0.2em] uppercase font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-[var(--ease-fluid)]">
                    {prop.location}
                  </span>
                </div>

                <h3 className="text-white font-light font-[var(--font-display)] text-3xl lg:text-4xl leading-tight mb-5">
                  {prop.title}
                </h3>

                <div className="flex items-center justify-between border-t border-white/15 pt-4">
                  <span className="text-white/60 text-[13px] tracking-wide">{prop.specs}</span>
                  <span className="text-white font-medium tracking-wider text-[15px]">{prop.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
