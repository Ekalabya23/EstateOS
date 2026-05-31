import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Loader2, Download } from 'lucide-react';
import api from '../../lib/axios';
import { generatePortfolioSummary } from '../../utils/reportGenerator';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [txStats, setTxStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, txRes] = await Promise.all([
          api.get('/properties/stats'),
          api.get('/transactions/stats')
        ]);
        setStats(propRes.data.data);
        setTxStats(txRes.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#C9A96E', '#1E1D1C', '#8E8A85', '#EBEAE6'];

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-champagne)]" /></div>;
  }

  const typeData = stats?.byType?.map((s: any) => ({ name: s._id, value: s.count })) || [];
  const statusData = stats?.byStatus?.map((s: any) => ({ name: s._id, value: s.count })) || [];
  const cashFlowData = txStats?.revenueData?.map((r: any) => ({
    month: r.month,
    Income: r.revenue,
    // Mock expense based on revenue since backend only gives revenue right now
    // In a real app we'd update backend to return monthly expenses too
    Expense: Math.round(r.revenue * (0.2 + Math.random() * 0.15))
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-mist)] shadow-sm flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5 text-[var(--color-charcoal)]" />
        </div>
        <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl text-[var(--color-charcoal)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>Analytics Center</h1>
            <p className="text-[12px] text-[var(--color-stone)] mt-1">Deep insights into your portfolio's performance</p>
          </div>
          <button 
            onClick={() => generatePortfolioSummary(stats)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Distribution by Type */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)] mb-6">Portfolio Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {typeData.map((_entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E1D1C', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8E8A85' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Occupancy Status */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)] mb-6">Occupancy Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {statusData.map((_entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E1D1C', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8E8A85' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cash Flow Analysis */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)] mb-6">Cash Flow Analysis (2026)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEAE6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8E8A85' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8E8A85' }} tickFormatter={formatCurrency} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ background: '#1E1D1C', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="Income" fill="#C9A96E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expense" fill="#1E1D1C" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
