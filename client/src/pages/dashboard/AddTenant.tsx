import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, DollarSign, Loader2, Check } from 'lucide-react';
import api from '../../lib/axios';

interface Property {
  _id: string;
  title: string;
}

export default function AddTenant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    property: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    securityDeposit: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get('/properties', { params: { status: 'available' } });
        setProperties(data.data);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      }
    };
    fetchProperties();
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
        rentAmount: Number(form.rentAmount),
        securityDeposit: Number(form.securityDeposit),
      };

      await api.post('/tenants', payload);
      navigate('/dashboard/tenants');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add tenant. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] placeholder:text-[var(--color-stone-light)] focus:outline-none focus:border-[var(--color-champagne)]/50 focus:ring-1 focus:ring-[var(--color-champagne)]/10 transition-all';
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] mb-1.5';

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => navigate('/dashboard/tenants')}
          className="p-1.5 rounded-lg border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-stone)]" />
        </button>
        <div>
          <h1 className="text-xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Add Tenant
          </h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">Register a new lease agreement</p>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[13px]">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Personal Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" className={inputClass} required value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" className={inputClass} required value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" className={inputClass} required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" className={inputClass} required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
          </div>
        </motion.div>

        {/* Lease Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Lease Details</h2>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Property</label>
            <select className={inputClass} required value={form.property} onChange={(e) => updateField('property', e.target.value)}>
              <option value="" disabled>Select a property...</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Lease Start</label>
              <input type="date" className={inputClass} required value={form.leaseStart} onChange={(e) => updateField('leaseStart', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Lease End</label>
              <input type="date" className={inputClass} required value={form.leaseEnd} onChange={(e) => updateField('leaseEnd', e.target.value)} />
            </div>
          </div>
        </motion.div>

        {/* Financials */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white rounded-xl border border-[var(--color-mist)] p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Financials</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>Monthly Rent (₹)</label>
              <input type="number" className={inputClass} placeholder="e.g. 125000" required value={form.rentAmount} onChange={(e) => updateField('rentAmount', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Security Deposit (₹)</label>
              <input type="number" className={inputClass} placeholder="e.g. 500000" required value={form.securityDeposit} onChange={(e) => updateField('securityDeposit', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} required value={form.status} onChange={(e) => updateField('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="past">Past</option>
            </select>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="flex items-center justify-between pt-2 pb-4">
          <button type="button" onClick={() => navigate('/dashboard/tenants')} className="px-5 py-2.5 rounded-lg border border-[var(--color-mist)] text-[13px] font-medium text-[var(--color-stone)] hover:bg-[var(--color-warm-white)] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Register Tenant'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
