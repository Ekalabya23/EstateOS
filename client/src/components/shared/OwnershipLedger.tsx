import { History, ArrowRight, Activity, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LedgerItem {
  id: string;
  type: 'ownership' | 'tenant' | 'transaction';
  date: string;
  title: string;
  subtitle: string;
  amount?: number;
  rating?: number;
}

interface OwnershipLedgerProps {
  ownershipHistory: any[];
  tenantHistory: any[];
  transactions?: any[];
}

export default function OwnershipLedger({ ownershipHistory = [], tenantHistory = [], transactions = [] }: OwnershipLedgerProps) {
  
  // Normalize data into a single timeline array
  const timeline: LedgerItem[] = [];

  ownershipHistory.forEach(oh => {
    timeline.push({
      id: oh._id,
      type: 'ownership',
      date: new Date(oh.purchaseDate).toLocaleDateString(),
      title: 'Property Acquired',
      subtitle: `Acquired by ${oh.newOwner?.name || 'Investor'}`,
      amount: oh.purchasePrice
    });
  });

  tenantHistory.forEach(th => {
    timeline.push({
      id: th._id,
      type: 'tenant',
      date: new Date(th.leaseStart).toLocaleDateString(),
      title: 'Lease Activated',
      subtitle: `Tenant: ${th.user?.name || th.firstName + ' ' + th.lastName}`,
      rating: th.user?.reputationScore
    });
  });

  transactions.forEach(tr => {
    // Only show certain types of transactions in the ledger, like Capital Expenditures, Appraisals, etc.
    if (tr.category !== 'rent') {
      timeline.push({
        id: tr._id,
        type: 'transaction',
        date: new Date(tr.date).toLocaleDateString(),
        title: tr.category.charAt(0).toUpperCase() + tr.category.slice(1),
        subtitle: tr.description || 'Asset transaction',
        amount: tr.amount
      });
    }
  });

  // Sort descending by date
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (timeline.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-mist)] p-6 shadow-sm">
        <h3 className="text-[16px] font-semibold text-[var(--color-charcoal)] font-display mb-1">Asset Ledger</h3>
        <p className="text-[13px] text-[var(--color-stone)]">No historical data available for this asset yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-mist)] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[var(--color-champagne)]/10 flex items-center justify-center">
          <History className="w-5 h-5 text-[var(--color-champagne-dark)]" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-[var(--color-charcoal)] font-display leading-none">Asset Ledger</h3>
          <p className="text-[12px] text-[var(--color-stone)] mt-1 tracking-wide">Immutable transaction history</p>
        </div>
      </div>

      <div className="relative pl-6 border-l-2 border-[var(--color-mist)] space-y-8">
        {timeline.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              item.type === 'ownership' ? 'bg-[var(--color-charcoal)]' : item.type === 'transaction' ? 'bg-[var(--color-stone)]' : 'bg-[var(--color-champagne-dark)]'
            }`} />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-[var(--color-stone)] tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest ${
                    item.type === 'ownership' ? 'bg-[var(--color-charcoal)] text-white' : item.type === 'transaction' ? 'bg-[var(--color-stone-light)] text-white' : 'bg-[var(--color-cream)] text-[var(--color-charcoal)]'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <h4 className="text-[15px] font-semibold text-[var(--color-charcoal)] mt-1">{item.title}</h4>
                <p className="text-[13px] text-[var(--color-stone)] mt-0.5">{item.subtitle}</p>
              </div>

              {/* Badges / Metrics */}
              <div className="flex items-center gap-3">
                {item.amount && (
                  <div className="bg-[var(--color-warm-white)] px-3 py-1.5 rounded-lg border border-[var(--color-mist)]">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-stone)]">Value</div>
                    <div className="text-[14px] font-display font-medium text-[var(--color-charcoal)]">
                      ₹{item.amount.toLocaleString()}
                    </div>
                  </div>
                )}
                {item.rating !== undefined && (
                  <div className="bg-[var(--color-warm-white)] px-3 py-1.5 rounded-lg border border-[var(--color-mist)]">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-stone)]">Trust Score</div>
                    <div className="text-[14px] font-display font-medium text-[var(--color-charcoal)] flex items-center gap-1">
                      {item.rating} <Star className="w-3 h-3 fill-[var(--color-champagne-dark)] text-[var(--color-champagne-dark)]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
