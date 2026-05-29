import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Brain, ScanText, Target, Sofa, BarChart3 } from 'lucide-react';

export default function AIInsights() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="ai" ref={sectionRef} className="section-dense bg-[var(--color-ivory)] relative">
      
      <div className="container-cinematic relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[var(--color-champagne-dark)] uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">Artificial Intelligence</span>
          <h2 className="heading-section mb-6">Cognitive <span className="italic font-light text-[var(--color-stone)]">Real Estate.</span></h2>
          <p className="text-body-elegant">
            The industry's first cognitive engine. Predicting market shifts, automating contract analysis, and personalizing client experiences at scale.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid-12 auto-rows-[320px]">
          
          {/* Card 1 (Large - Spans 8 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-8 glass-premium rounded-[2rem] p-10 glow-on-hover relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 mesh-champagne rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <Brain className="w-8 h-8 text-[var(--color-champagne-dark)] mb-6" />
            <div>
              <h3 className="text-2xl font-[var(--font-display)] mb-2 text-[var(--color-charcoal)]">Predictive Valuation Engine</h3>
              <p className="text-[var(--color-stone)] text-sm max-w-sm leading-relaxed">Analyzes millions of data points across global markets to predict property yields with 94% accuracy over 5 years.</p>
            </div>
            {/* Interactive simulation graphic */}
            <div className="absolute right-10 bottom-10 w-1/3 h-1/2 border-l border-t border-[var(--color-charcoal)]/10">
              <motion.div 
                animate={{ x: ['0%', '100%', '0%'] }} 
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-champagne)] to-transparent opacity-50"
              />
            </div>
          </motion.div>

          {/* Card 2 (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-4 glass-premium rounded-[2rem] p-10 glow-on-hover relative overflow-hidden flex flex-col justify-between bg-[var(--color-charcoal)]"
          >
            <ScanText className="w-8 h-8 text-white mb-6" />
            <div>
              <h3 className="text-xl font-[var(--font-display)] mb-2 text-white">Smart Contracts</h3>
              <p className="text-white/60 text-sm leading-relaxed">Instant legal summaries and risk highlighting for 100-page lease agreements.</p>
            </div>
          </motion.div>

          {/* Card 3 (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-4 glass-premium rounded-[2rem] p-10 glow-on-hover relative overflow-hidden flex flex-col justify-between"
          >
            <Target className="w-8 h-8 text-[var(--color-champagne-dark)] mb-6" />
            <div>
              <h3 className="text-xl font-[var(--font-display)] mb-2 text-[var(--color-charcoal)]">Client Matching</h3>
              <p className="text-[var(--color-stone)] text-sm leading-relaxed">Behavioral targeting pairs off-market luxury units with verified high-net-worth buyers.</p>
            </div>
          </motion.div>

          {/* Card 4 (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-4 glass-premium rounded-[2rem] p-10 glow-on-hover relative overflow-hidden flex flex-col justify-between"
          >
            <Sofa className="w-8 h-8 text-[var(--color-champagne-dark)] mb-6" />
            <div>
              <h3 className="text-xl font-[var(--font-display)] mb-2 text-[var(--color-charcoal)]">Generative Staging</h3>
              <p className="text-[var(--color-stone)] text-sm leading-relaxed">Instantly restyle empty spaces with luxury designer furniture in one click.</p>
            </div>
          </motion.div>

          {/* Card 5 (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-4 glass-premium rounded-[2rem] p-10 glow-on-hover relative overflow-hidden flex flex-col justify-between"
          >
            <Sparkles className="w-8 h-8 text-[var(--color-champagne-dark)] mb-6" />
            <div>
              <h3 className="text-xl font-[var(--font-display)] mb-2 text-[var(--color-charcoal)]">Dynamic Copy</h3>
              <p className="text-[var(--color-stone)] text-sm leading-relaxed">Editorial-grade property descriptions generated in 12 languages simultaneously.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
