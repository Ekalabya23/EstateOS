import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { CreditCard, FileText, Wrench, Star } from 'lucide-react';
import api from '../../lib/axios';
import { loadRazorpay } from '../../lib/razorpay';
import toast from 'react-hot-toast';

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLease = async () => {
      try {
        const { data } = await api.get('/tenants/me');
        setLease(data.data);
      } catch (err) {
        console.error('Failed to fetch lease', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLease();
  }, []);

  const handlePayRent = async () => {
    if (!lease) return;
    try {
      // 1. Create order
      const { data: orderData } = await api.post('/payments/create-order', {
        amount: lease.rentAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: 'INR',
        name: 'EstateOS',
        description: 'Rent Payment',
        order_id: orderData.data.id,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              ...response,
              amount: lease.rentAmount,
              tenantId: lease._id,
              propertyId: lease.property._id,
            });
            alert('Rent paid successfully!');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#1a1a1a', // charcoal
        },
      };

      const RazorpayConstructor = await loadRazorpay();
      if (!RazorpayConstructor) {
        toast.error('Failed to load Razorpay');
        return;
      }
      const rzp = new RazorpayConstructor(options);
      rzp.open();
    } catch (err) {
      console.error('Failed to initiate payment', err);
      alert('Failed to initiate payment');
    }
  };

  if (loading) return <div className="p-8 text-[var(--color-stone)]">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome home, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[14px] text-[var(--color-stone)] mt-1">Here is the latest on your lease at {lease?.property?.title || 'your property'}.</p>
          </div>
          {lease?.reputationScore !== undefined && (
            <div className="bg-[var(--color-cream)] px-4 py-2 rounded-xl flex items-center gap-2 border border-[var(--color-mist)]">
              <Star className="w-4 h-4 text-orange-400 fill-current" />
              <div className="text-[14px] font-semibold text-[var(--color-charcoal)]">
                {lease.reputationScore.toFixed(1)} <span className="text-[12px] text-[var(--color-stone)] font-normal">Tenant Score</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Payment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-[var(--color-mist)] shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
            <CreditCard className="w-5 h-5 text-[var(--color-champagne-dark)]" />
          </div>
          <p className="text-[12px] text-[var(--color-stone)] uppercase tracking-wider font-semibold mb-1">Next Payment</p>
          <h2 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>₹{(lease?.rentAmount || 0).toLocaleString()}</h2>
          <p className="text-[12px] text-[var(--color-stone)] mb-6">Due on 1st of next month</p>
          <button 
            onClick={handlePayRent}
            className="w-full py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
          >
            Pay Rent
          </button>
        </motion.div>

        {/* Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-[var(--color-mist)] shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
            <Wrench className="w-5 h-5 text-[var(--color-champagne-dark)]" />
          </div>
          <p className="text-[12px] text-[var(--color-stone)] uppercase tracking-wider font-semibold mb-1">Maintenance</p>
          <h2 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>0 Open</h2>
          <p className="text-[12px] text-[var(--color-stone)] mb-6">Track your maintenance tickets</p>
          <button 
            onClick={() => window.location.href = '/dashboard/maintenance'}
            className="w-full py-2.5 bg-[var(--color-warm-white)] text-[var(--color-charcoal)] border border-[var(--color-mist)] text-[13px] font-medium rounded-lg hover:bg-[var(--color-cream)] transition-colors"
          >
            Open Maintenance Hub
          </button>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-[var(--color-mist)] shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-[var(--color-champagne-dark)]" />
          </div>
          <p className="text-[12px] text-[var(--color-stone)] uppercase tracking-wider font-semibold mb-1">Lease Document</p>
          <h2 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{lease ? 'Active' : 'No Lease'}</h2>
          <p className="text-[12px] text-[var(--color-stone)] mb-6">
            {lease ? `Expires ${new Date(lease.leaseEnd).toLocaleDateString()}` : 'Contact your landlord'}
          </p>
          <button 
            onClick={() => {
              if (lease?.documents?.[0]) {
                window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${lease.documents[0]}`, '_blank');
              } else {
                toast.error('No agreement uploaded yet');
              }
            }}
            className="w-full py-2.5 bg-[var(--color-warm-white)] text-[var(--color-charcoal)] border border-[var(--color-mist)] text-[13px] font-medium rounded-lg hover:bg-[var(--color-cream)] transition-colors">
            View Agreement
          </button>
        </motion.div>

      </div>
    </div>
  );
}
