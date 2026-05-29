import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, Building2 } from 'lucide-react';

export default function AnalyticsPreview() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="analytics" ref={sectionRef} className="section-dense bg-[var(--color-charcoal-dark)] relative overflow-hidden">
      
      {/* Background Mesh & Grid */}
      <div className="absolute inset-0 mesh-champagne opacity-20 pointer-events-none" />
      <div className="absolute inset-0 architectural-grid-dark opacity-10 pointer-events-none" />

      <div className="container-cinematic relative z-10">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[var(--color-stone)] uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">Bloomberg Terminal Meets Apple</span>
          <h2 className="heading-section text-white mb-6">Executive <span className="italic font-light text-[var(--color-champagne)]">Intelligence</span></h2>
          <p className="text-body-elegant text-white/60">
            Real-time data visualization designed for high-net-worth portfolio management. Live yields, predictive occupancy models, and instant financial reporting.
          </p>
        </div>

        {/* The Dashboard Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full mx-auto glass-premium-dark rounded-[2.5rem] p-4 lg:p-10 border border-white/10 shadow-[var(--shadow-cinematic)] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="flex gap-4">
              <span className="text-white/40 text-xs font-mono uppercase">System: Online</span>
              <span className="text-[var(--color-champagne)] text-xs font-mono flex items-center gap-1">
                <Activity className="w-3 h-3" /> Live Feed
              </span>
            </div>
          </div>

          <div className="grid-12">
            
            {/* Main Chart Area (Spans 8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Top KPIs */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Portfolio Value", val: "$42.8M", trend: "+2.4%", icon: DollarSign },
                  { label: "Active Leases", val: "156", trend: "+12", icon: Building2 },
                  { label: "Avg. Yield", val: "8.2%", trend: "+0.4%", icon: TrendingUp }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-[var(--color-champagne)]/30 transition-colors">
                    <stat.icon className="w-4 h-4 text-[var(--color-champagne)] mb-3" />
                    <div className="text-white/50 text-[10px] uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl text-white font-[var(--font-display)]">{stat.val}</div>
                    <div className="text-[var(--color-success)] text-xs font-mono mt-2">{stat.trend}</div>
                  </div>
                ))}
              </div>

              {/* Chart Visual */}
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden min-h-[300px]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-white/70 text-sm font-medium">Revenue Trajectory</span>
                  <div className="flex gap-2">
                    {['1D', '1W', '1M', '1Y'].map(t => (
                      <span key={t} className={`text-xs px-2 py-1 rounded ${t === '1Y' ? 'bg-white/20 text-white' : 'text-white/40'}`}>{t}</span>
                    ))}
                  </div>
                </div>
                
                {/* SVG Chart Graphic */}
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[70%]">
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-champagne)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--color-champagne)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 15 L60 18 L70 10 L80 12 L90 5 L100 2" 
                    fill="none" 
                    stroke="var(--color-champagne)" 
                    strokeWidth="0.5"
                  />
                  <motion.path 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 1.5 }}
                    d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 15 L60 18 L70 10 L80 12 L90 5 L100 2 L100 40 L0 40 Z" 
                    fill="url(#glow)" 
                  />
                </svg>
              </div>
            </div>

            {/* Right Sidebar (Spans 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Activity Feed */}
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5">
                <span className="text-white/70 text-sm font-medium mb-6 block">Live Transactions</span>
                <div className="space-y-4">
                  {[
                    { act: "Rent Processed", loc: "The Azure Penthouse", amt: "+$24,000", time: "Just now" },
                    { act: "Maintenance Logged", loc: "Villa Serena", amt: "-$850", time: "2m ago" },
                    { act: "Lease Renewed", loc: "Ivory Residences", amt: "12 mo", time: "15m ago" },
                    { act: "Deposit Received", loc: "Emerald Gardens", amt: "+$12,500", time: "1h ago" },
                  ].map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <div className="text-white text-sm mb-1">{log.act}</div>
                        <div className="text-white/40 text-xs font-mono">{log.loc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--color-champagne)] text-sm font-mono">{log.amt}</div>
                        <div className="text-white/30 text-[10px] uppercase mt-1">{log.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
