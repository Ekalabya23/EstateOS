import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, Plus } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import api from '../../lib/axios';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  property?: { title: string };
  tenant?: { firstName: string; lastName: string };
}

export default function Financials() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, netIncome: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [transRes, statsRes] = await Promise.all([
          api.get('/transactions', { params: { limit: 50 } }),
          api.get('/transactions/stats')
        ]);
        setTransactions(transRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch financials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Financials
          </h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">Overview of your portfolio's cash flow</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/financials/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Transaction
        </button>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Net Income"
          value={formatCurrency(stats.netIncome)}
          trend="Current Year"
          trendUp={stats.netIncome >= 0}
          icon={DollarSign}
          delay={0.04}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalIncome)}
          trend="Income"
          trendUp={true}
          icon={ArrowUpRight}
          delay={0.08}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(stats.totalExpense)}
          trend="Costs"
          trendUp={false}
          icon={ArrowDownRight}
          delay={0.12}
        />
      </div>

      {/* Ledger Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-white rounded-xl border border-[var(--color-mist)] overflow-hidden flex flex-col"
      >
        <div className="px-5 py-4 border-b border-[var(--color-mist)] flex items-center justify-between bg-[var(--color-warm-white)]/30">
          <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)]">Transaction Ledger</h3>
          <div className="flex items-center gap-2 text-[12px] text-[var(--color-stone)]">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Income</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Expense</span>
          </div>
        </div>

        {loading ? (
          <div className="p-5 flex justify-center"><Activity className="w-5 h-5 text-[var(--color-champagne)] animate-spin" /></div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[var(--color-stone)]">No transactions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px] divide-y divide-[var(--color-mist)]/60">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-warm-white)]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[var(--color-charcoal)] truncate leading-snug">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-[var(--color-stone)] mt-0.5 flex gap-2">
                        <span className="capitalize">{tx.category}</span>
                        {tx.property && <span>• {tx.property.title}</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className={`text-[13px] font-mono font-semibold leading-snug ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[11px] text-[var(--color-stone-light)] uppercase tracking-wide mt-0.5">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
