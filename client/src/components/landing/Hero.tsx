import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Activity, ChevronDown } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] pt-32 pb-20 flex flex-col justify-between overflow-hidden bg-[var(--color-ivory)]">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      <div className="container-cinematic flex-1 grid-12 relative z-10 items-center">
        
        {/* LEFT: Typography & Narrative (Spans 5 cols) */}
        <motion.div style={{ y: textY }} className="col-span-12 lg:col-span-5 pt-10">
          <div className="overflow-hidden mb-6">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--color-champagne)]/30 bg-[var(--color-champagne)]/5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-champagne-dark)]">
                EstateOS Enterprise 2.0
              </span>
            </motion.div>
          </div>

          <h1 className="heading-cinematic text-balance mb-8">
            <div className="overflow-hidden"><motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>The Architecture</motion.span></div>
            <div className="overflow-hidden"><motion.span className="block italic font-light text-[var(--color-stone)]" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>of Tomorrow's</motion.span></div>
            <div className="overflow-hidden"><motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>Real Estate.</motion.span></div>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-body-elegant max-w-lg mb-12"
          >
            A cinematic operating system designed for the world's most exclusive property portfolios. Merging artificial intelligence with uncompromising aesthetic precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6"
          >
            <button className="btn-cinematic">
              Deploy EstateOS
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="group flex items-center gap-3 text-[var(--color-charcoal)] font-medium text-sm tracking-wide transition-colors hover:text-[var(--color-champagne-dark)]">
              <div className="w-10 h-10 rounded-full border border-[var(--color-mist)] flex items-center justify-center group-hover:border-[var(--color-champagne)] transition-colors">
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </div>
              Watch the Film
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT: Cinematic Visual (Spans 6 cols, offset 1) */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 relative h-[600px] w-full mt-10 lg:mt-0 lg:h-[80vh] min-h-[600px] flex items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-10 left-0 right-0 rounded-[2rem] overflow-hidden shadow-[var(--shadow-cinematic)]"
          >
            <motion.div 
              style={{ scale: imageScale, y: imageY }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Live Card Overlay - scaled proportionally */}
            <motion.div 
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-8 left-8 right-8 lg:left-auto lg:w-[320px] glass-premium-dark rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/60 text-xs tracking-widest uppercase font-medium">Live Yield</span>
                <span className="flex items-center gap-1.5 text-[var(--color-success)] text-xs font-bold bg-[var(--color-success)]/20 px-2 py-1 rounded border border-[var(--color-success)]/30">
                  <Activity className="w-3 h-3" /> +12.4%
                </span>
              </div>
              <div className="text-3xl text-white font-light font-[var(--font-display)]">
                $14.2M <span className="text-white/40 text-sm font-[var(--font-body)]">/mo</span>
              </div>
              <div className="mt-5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '76%' }}
                  transition={{ duration: 2, delay: 1.5, ease: 'easeOut' }}
                  className="h-full bg-[var(--color-champagne)] shadow-[0_0_10px_var(--color-champagne)]"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* BOTTOM: Ticker & Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="container-cinematic mt-16 flex items-end justify-between border-t border-[var(--color-mist)] pt-8 relative z-10"
      >
        <div className="flex gap-12 items-center text-sm font-medium text-[var(--color-stone-light)]">
          <span>Trusted by</span>
          <span className="text-[var(--color-charcoal)] font-[var(--font-display)] italic text-lg">Vance & Co</span>
          <span className="text-[var(--color-charcoal)] font-[var(--font-display)] text-lg uppercase tracking-wider">Sterling</span>
          <span className="text-[var(--color-charcoal)] font-[var(--font-display)] italic text-lg">Azure</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-stone)]">Discover</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--color-charcoal)] group-hover:text-[var(--color-champagne)] transition-colors" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
