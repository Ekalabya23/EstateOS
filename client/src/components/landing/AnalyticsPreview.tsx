import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, Building2 } from 'lucide-react';

const kpis = [
  { label: 'Portfolio Value', val: '$42.8M', trend: '+2.4%', icon: DollarSign },
  { label: 'Active Leases', val: '156', trend: '+12', icon: Building2 },
  { label: 'Avg. Yield', val: '8.2%', trend: '+0.4%', icon: TrendingUp },
];

const transactions = [
  { act: 'Rent Processed', loc: 'The Azure Penthouse', amt: '+$24,000', time: 'Just now' },
  { act: 'Maintenance Logged', loc: 'Villa Serena', amt: '-$850', time: '2m ago' },
  { act: 'Lease Renewed', loc: 'Ivory Residences', amt: '12 mo', time: '15m ago' },
  { act: 'Deposit Received', loc: 'Emerald Gardens', amt: '+$12,500', time: '1h ago' },
];

export default function AnalyticsPreview() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="section-dense bg-[var(--color-charcoal-dark)] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 mesh-champagne opacity-15 pointer-events-none" />
      <div className="absolute inset-0 architectural-grid-dark opacity-8 pointer-events-none" />

      <div className="container-cinematic relative z-10">

        {/* ── Section header ── */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[var(--color-stone-light)] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4 block">
            Bloomberg Terminal Meets Apple
          </span>
          <h2 className="heading-section text-white mb-5 leading-[1.05]">
            Executive{' '}
            <span className="italic font-light text-[var(--color-champagne)]">Intelligence</span>
          </h2>
          <p className="text-body-elegant text-white/55 text-base">
            Real-time data visualization for high-net-worth portfolio management — live yields,
            predictive occupancy, and instant financial reporting.
          </p>
        </div>

        {/* ── Dashboard mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-premium-dark rounded-[2rem] border border-white/8 shadow-[var(--shadow-cinematic)] overflow-hidden"
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-6">
              <span className="text-white/35 text-[11px] font-mono uppercase tracking-widest">
                System: Online
              </span>
              <span className="text-[var(--color-champagne)] text-[11px] font-mono flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                Live Feed
              </span>
            </div>
            <div className="w-[80px]" /> {/* spacer for center balance */}
          </div>

          {/* Dashboard body */}
          <div className="p-8 lg:p-10">
            <div className="grid-12 gap-6">

              {/* Left — Chart area */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-4">
                  {kpis.map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/6 rounded-2xl p-5 hover:border-[var(--color-champagne)]/25 transition-colors duration-500"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-4 h-4 text-[var(--color-champagne)]" />
                        <span className="text-[var(--color-success)] text-[11px] font-mono font-semibold">
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">
                        {stat.label}
                      </div>
                      <div className="text-2xl text-white font-[var(--font-display)] font-light leading-none">
                        {stat.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-white/5 border border-white/6 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <span className="text-white/70 text-sm font-medium">Revenue Trajectory</span>
                    <div className="flex items-center gap-1">
                      {['1D', '1W', '1M', '1Y'].map((t) => (
                        <span
                          key={t}
                          className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                            t === '1Y'
                              ? 'bg-white/15 text-white font-medium'
                              : 'text-white/35 hover:text-white/60'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SVG sparkline */}
                  <div className="relative h-48 w-full">
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full"
                    >
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 2, delay: 0.6, ease: 'easeInOut' }}
                        d="M0 36 L10 33 L20 35 L30 26 L40 29 L50 16 L60 19 L70 11 L80 13 L90 6 L100 3"
                        fill="none"
                        stroke="#C9A96E"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                      />
                      <motion.path
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        d="M0 36 L10 33 L20 35 L30 26 L40 29 L50 16 L60 19 L70 11 L80 13 L90 6 L100 3 L100 40 L0 40 Z"
                        fill="url(#chartGlow)"
                      />
                    </svg>

                    {/* Y-axis labels */}
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
                      {['$80K', '$60K', '$40K', '$20K'].map((l) => (
                        <span key={l} className="text-[9px] font-mono text-white/25">{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* X-axis months */}
                  <div className="flex justify-between px-6 pb-5 pt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                      <span key={m} className="text-[9px] font-mono text-white/25">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Activity feed */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white/5 border border-white/6 rounded-2xl p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white/70 text-sm font-medium">Live Transactions</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]" />
                    </span>
                  </div>

                  <div className="space-y-0 divide-y divide-white/5">
                    {transactions.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                        className="flex items-start justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 mr-4">
                          <p className="text-white text-[13px] font-medium leading-tight mb-1">
                            {log.act}
                          </p>
                          <p className="text-white/35 text-[11px] font-mono truncate">
                            {log.loc}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[var(--color-champagne)] text-[13px] font-mono leading-tight">
                            {log.amt}
                          </p>
                          <p className="text-white/25 text-[10px] uppercase tracking-widest mt-1">
                            {log.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
