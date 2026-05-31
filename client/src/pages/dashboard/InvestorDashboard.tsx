import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { Building2, TrendingUp, PieChart, MapPin } from 'lucide-react';
import api from '../../lib/axios';
import StatusBadge from '../../components/dashboard/StatusBadge';

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalValue: 0, totalProperties: 0, monthlyYield: 0, annualYieldPercent: 0 });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, propsRes] = await Promise.all([
          api.get('/properties/portfolio/stats'),
          api.get('/properties?myPortfolio=true')
        ]);
        setStats(statsRes.data.data);
        setProperties(propsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch investor data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (loading) return <div className="p-8 text-[var(--color-stone)]">Loading portfolio...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
          Portfolio, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[14px] text-[var(--color-stone)] mt-1">Track your investments and ROI.</p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Invested */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[var(--color-charcoal)] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 text-[var(--color-champagne)]" />
          </div>
          <p className="text-[12px] text-white/60 uppercase tracking-wider font-semibold mb-1">Total Value</p>
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatPrice(stats.totalValue)}</h2>
          <p className="text-[12px] text-emerald-400 mb-0 font-medium">Portfolio Gross Value</p>
        </motion.div>

        {/* Properties Owned */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-[var(--color-mist)] shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5 text-[var(--color-champagne-dark)]" />
          </div>
          <p className="text-[12px] text-[var(--color-stone)] uppercase tracking-wider font-semibold mb-1">Properties</p>
          <h2 className="text-3xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{stats.totalProperties}</h2>
          <p className="text-[12px] text-[var(--color-stone)] mb-0">Active assets</p>
        </motion.div>

        {/* Monthly Yield */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-[var(--color-mist)] shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
            <PieChart className="w-5 h-5 text-[var(--color-champagne-dark)]" />
          </div>
          <p className="text-[12px] text-[var(--color-stone)] uppercase tracking-wider font-semibold mb-1">Rental Yield</p>
          <h2 className="text-3xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatPrice(stats.monthlyYield)}</h2>
          <p className="text-[12px] text-emerald-500 font-medium mb-0">{stats.annualYieldPercent}% Annual ROI</p>
        </motion.div>

      </div>

      {/* Properties Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Your Assets</h2>
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-2xl border border-[var(--color-mist)] p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-warm-white)] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[var(--color-stone-light)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">No Active Investments</h3>
            <p className="text-sm text-[var(--color-stone)] mb-6 max-w-md mx-auto">
              You haven't invested in any properties yet. Browse our exclusive listings to start building your portfolio.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop, i) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-[var(--color-mist)] hover:shadow-lg transition-all duration-300"
              >
                <div 
                  className="h-48 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${prop.images?.[0] || 'linear-gradient(to right, #f3f4f6, #e5e7eb)'})` }}
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-charcoal)] leading-tight">{prop.title}</h3>
                    <StatusBadge status={prop.status} />
                  </div>
                  <p className="text-[13px] text-[var(--color-stone)] flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {prop.city}, {prop.state}
                  </p>
                  
                  <div className="flex justify-between items-end border-t border-[var(--color-mist)] pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] font-semibold">Valuation</p>
                      <p className="text-lg font-semibold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
                        {formatPrice(prop.price)}
                      </p>
                    </div>
                    {prop.status === 'rented' && (
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-widest text-emerald-600 font-semibold">Generating</p>
                        <p className="text-[13px] font-medium text-emerald-600">Passive Income</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
