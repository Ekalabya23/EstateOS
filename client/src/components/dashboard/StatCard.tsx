import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({ label, value, trend, trendUp, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-xl border border-[var(--color-mist)] p-5 hover:shadow-sm hover:border-[var(--color-champagne)]/30 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-cream)] flex items-center justify-center group-hover:bg-[var(--color-champagne)]/10 transition-colors duration-300">
          <Icon className="w-4 h-4 text-[var(--color-champagne-dark)]" />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          trendUp
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-red-50 text-red-500'
        }`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-2xl font-light text-[var(--color-charcoal)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-stone-light)] mt-1.5 font-medium">
        {label}
      </p>
    </motion.div>
  );
}
