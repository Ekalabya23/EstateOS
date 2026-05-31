import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Loader2, Check, Hash } from 'lucide-react';
import api from '../../lib/axios';

interface Property { _id: string; title: string; }
interface Tenant { _id: string; firstName: string; lastName: string; }

export default function AddTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: 'income',
    category: 'rent',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    property: '',
    tenant: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, tenRes] = await Promise.all([
          api.get('/properties'),
          api.get('/tenants')
        ]);
        setProperties(propRes.data.data);
        setTenants(tenRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        property: form.property || undefined,
        tenant: form.tenant || undefined,
      };

      await api.post('/transactions', payload);
      navigate('/dashboard/financials');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log transaction.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] placeholder:text-[var(--color-stone-light)] focus:outline-none focus:border-[var(--color-champagne)]/50 focus:ring-1 focus:ring-[var(--color-champagne)]/10 transition-all';
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] mb-1.5';

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/financials')} className="p-1.5 rounded-lg border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] transition-colors">
          <ArrowLeft className="w-4 h-4 text-[var(--color-stone)]" />
        </button>
        <div>
          <h1 className="text-xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>Log Transaction</h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">Record income or expense</p>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[13px]">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Transaction Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>Type</label>
              <select className={inputClass} required value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} required value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                <option value="rent">Rent</option>
                <option value="maintenance">Maintenance</option>
                <option value="tax">Tax</option>
                <option value="insurance">Insurance</option>
                <option value="utility">Utility</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input type="number" className={inputClass} placeholder="e.g. 50000" required value={form.amount} onChange={(e) => updateField('amount', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} required value={form.date} onChange={(e) => updateField('date', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <input type="text" className={inputClass} placeholder="e.g. October Rent" required value={form.description} onChange={(e) => updateField('description', e.target.value)} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <Hash className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Linkages (Optional)</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Property</label>
              <select className={inputClass} value={form.property} onChange={(e) => updateField('property', e.target.value)}>
                <option value="">None</option>
                {properties.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tenant</label>
              <select className={inputClass} value={form.tenant} onChange={(e) => updateField('tenant', e.target.value)}>
                <option value="">None</option>
                {tenants.map((t) => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="flex items-center justify-between pt-2 pb-4">
          <button type="button" onClick={() => navigate('/dashboard/financials')} className="px-5 py-2.5 rounded-lg border border-[var(--color-mist)] text-[13px] font-medium text-[var(--color-stone)] hover:bg-[var(--color-warm-white)] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Log Transaction'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
