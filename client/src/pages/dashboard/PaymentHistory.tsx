import { useState, useEffect } from 'react';
import { Download, CreditCard, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  category: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/tenants/me/payments');
        setPayments(data.data);
      } catch (error) {
        console.error('Failed to fetch payments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'pending': return <Calendar className="w-4 h-4 mr-1.5" />;
      case 'failed': return <AlertCircle className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  // Generate fake streak data for visual calendar (last 90 days)
  const streakDays = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    // Simulate rent payments around the 1st/5th
    const isPaymentDay = date.getDate() === 5 && i < 85; 
    return { date, active: isPaymentDay };
  });

  if (loading) {
    return <div className="p-8">Loading payment history...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
          Payment History
        </h1>
        <p className="text-[var(--color-stone)]">Track your rent payments and download receipts.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-charcoal)] text-white p-6 rounded-3xl shadow-xl border border-[var(--color-mist)]">
          <div className="flex items-center gap-3 text-[var(--color-champagne)] mb-4">
            <CreditCard className="w-6 h-6" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Total Paid (YTD)</h3>
          </div>
          <p className="text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--color-mist)] md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-stone)] mb-4">Payment Streak</h3>
          <div className="flex flex-wrap gap-1">
            {streakDays.map((day, i) => (
              <div 
                key={i} 
                title={day.date.toDateString()}
                className={`w-3.5 h-3.5 rounded-sm ${day.active ? 'bg-[var(--color-champagne-dark)]' : 'bg-[var(--color-warm-white)]'}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-[var(--color-stone)] mt-3">Each block represents a day. Gold blocks mark successful rent payments.</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-mist)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-mist)]">
          <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-warm-white)] border-b border-[var(--color-mist)]">
                <th className="p-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-stone)]">Date</th>
                <th className="p-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-stone)]">Amount</th>
                <th className="p-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-stone)]">Status</th>
                <th className="p-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-stone)]">Reference</th>
                <th className="p-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-stone)] text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-[var(--color-mist)] last:border-0 hover:bg-[var(--color-warm-white)] transition-colors">
                  <td className="p-4 text-sm text-[var(--color-charcoal)]">
                    {new Date(payment.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="p-4 text-sm font-semibold text-[var(--color-charcoal)]">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-[var(--color-stone)]">
                    {payment.reference || payment._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      className="p-2 text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-black/5 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-stone)]">
                    No rent payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
