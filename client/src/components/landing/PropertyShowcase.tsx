import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';

const properties = [
  {
    id: 1,
    title: 'The Azure Penthouse',
    location: 'Mumbai, India',
    price: '₹8.5 Cr',
    specs: '4 Bed • 3 Bath • 3,800 sqft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-8',
    height: 'h-[600px]',
  },
  {
    id: 2,
    title: 'Villa Serena',
    location: 'Goa, India',
    price: '₹4.2 Cr',
    specs: '5 Bed • 4 Bath • 4,200 sqft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-4',
    height: 'h-[600px]',
  },
  {
    id: 3,
    title: 'Emerald Gardens',
    location: 'Bangalore, India',
    price: '₹3.8 Cr',
    specs: '4 Bed • 3 Bath • 3,500 sqft',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-5',
    height: 'h-[500px]',
  },
  {
    id: 4,
    title: 'Ivory Residences',
    location: 'Delhi, India',
    price: '₹6.1 Cr',
    specs: '6 Bed • 5 Bath • 5,100 sqft',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'col-span-12 lg:col-span-7',
    height: 'h-[500px]',
  },
];

export default function PropertyShowcase() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  // Parallax for the section background
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section id="portfolio" ref={containerRef} className="section-dense relative overflow-hidden bg-[var(--color-charcoal)]">
      {/* Background with parallax and noise */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 architectural-grid-dark" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-charcoal-dark)] pointer-events-none" />

      <div className="container-cinematic relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="text-[var(--color-champagne)] uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">Exclusive Portfolio</span>
            <h2 className="heading-section text-white">Curated Spaces for the <span className="italic font-light text-white/70">Extraordinary.</span></h2>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors border-b border-white/20 pb-2 hover:border-white"
          >
            <span className="text-sm tracking-widest uppercase">View Archive</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>

        {/* Asymmetrical 12-Column Grid */}
        <div className="grid-12">
          {properties.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
              className={`col-span-12 lg:${prop.colSpan} ${prop.height} group relative rounded-[2rem] overflow-hidden cursor-pointer bg-[var(--color-charcoal-dark)]`}
            >
              {/* Image with zoom on hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[var(--ease-fluid)] group-hover:scale-105"
                style={{ backgroundImage: `url(${prop.image})` }}
              />
              
              {/* Premium Gradient Masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-[var(--color-champagne)]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Hover Glow Border */}
              <div className="absolute inset-0 border border-white/10 rounded-[2rem] group-hover:border-[var(--color-champagne)]/50 transition-colors duration-700 z-20" />

              {/* Floating Action Button */}
              <div className="absolute top-10 right-10 z-20 w-12 h-12 rounded-full glass-premium-dark flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[var(--ease-fluid)]">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>

              {/* Metadata Overlay - Standardized 40px padding */}
              <div className="absolute bottom-0 left-0 right-0 p-10 z-20 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[var(--ease-fluid)]">
                <div className="overflow-hidden mb-2">
                  <span className="block text-[var(--color-champagne)] text-xs tracking-[0.2em] uppercase font-semibold transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-[var(--ease-fluid)]">
                    {prop.location}
                  </span>
                </div>
                <h3 className="text-3xl lg:text-4xl text-white font-light font-[var(--font-display)] mb-6">
                  {prop.title}
                </h3>
                <div className="flex items-center justify-between border-t border-white/20 pt-5 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white/80 text-sm tracking-wide">{prop.specs}</span>
                  <span className="text-white font-medium tracking-wider">{prop.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
