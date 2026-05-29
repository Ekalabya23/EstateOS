import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Key, FileSignature, Globe2 } from 'lucide-react';

export default function ManagementEcosystem() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="ecosystem" ref={sectionRef} className="section-dense bg-[var(--color-ivory)] border-t border-[var(--color-mist)] relative overflow-hidden">
      
      <div className="absolute right-0 top-0 w-1/2 h-full bg-[var(--color-warm-white)] -skew-x-12 translate-x-32 hidden lg:block" />

      <div className="container-cinematic relative z-10">
        <div className="grid-12 items-center">
          
          {/* Narrative Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-5"
          >
            <h2 className="heading-section text-balance mb-8">
              The Architecture of <br className="hidden lg:block"/>
              <span className="italic font-light text-[var(--color-stone)]">Total Control.</span>
            </h2>
            <p className="text-body-elegant max-w-lg mb-10">
              EstateOS is not a disjointed suite of tools. It is a singular, monolithic operating system designed to orchestrate the entire lifecycle of global real estate assets. 
            </p>
            
            <div className="space-y-8">
              {[
                { label: "Bank-Grade Infrastructure", desc: "End-to-end encryption with SOC2 Type II compliance.", icon: Shield },
                { label: "Global Liquidity", desc: "Multi-currency processing and international tax routing.", icon: Globe2 },
                { label: "Digital Custody", desc: "Cryptographically verifiable lease and deed management.", icon: FileSignature }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-mist)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-charcoal)] group-hover:text-white transition-colors duration-500">
                    <item.icon className="w-5 h-5 text-[var(--color-charcoal)] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-[var(--color-charcoal)] font-semibold text-lg mb-1 font-[var(--font-body)]">{item.label}</h4>
                    <p className="text-[var(--color-stone)] text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Side (Overlapping Density) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-6 lg:col-start-7 relative h-[600px] mt-16 lg:mt-0"
          >
            {/* Base Layer */}
            <div className="absolute top-10 right-10 bottom-10 left-10 rounded-[2rem] bg-cover bg-center shadow-[var(--shadow-editorial)]" 
                 style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")' }}>
              <div className="absolute inset-0 bg-black/20 rounded-[2rem]" />
            </div>

            {/* Floating Glass Panel 1 */}
            <div className="absolute top-0 left-0 glass-premium rounded-2xl p-6 w-64 shadow-[var(--shadow-cinematic)]">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-[var(--color-champagne-dark)]" />
                <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-charcoal)]">Access Granted</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-[var(--color-mist)] rounded-full" />
                <div className="w-2/3 h-2 bg-[var(--color-mist)] rounded-full" />
              </div>
            </div>

            {/* Floating Glass Panel 2 */}
            <div className="absolute bottom-0 right-0 glass-premium-dark rounded-2xl p-6 w-72 shadow-[var(--shadow-cinematic)]">
              <div className="text-white/50 text-xs font-mono uppercase mb-2">System Status</div>
              <div className="text-white font-[var(--font-display)] text-2xl mb-4">All Systems Operational</div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-success)]"></span>
                </span>
                <span className="text-white/70 text-sm font-mono">0ms latency</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
