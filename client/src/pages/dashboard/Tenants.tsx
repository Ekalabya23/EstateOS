import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, User, Mail, ArrowUpDown, Plus, CreditCard, Star, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { loadRazorpay } from '../../lib/razorpay';
import { generateTenantLedger } from '../../utils/reportGenerator';

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  property: { _id: string; title: string };
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: string;
  reputationScore?: number;
  reputationFeedback?: string;
}

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('-createdAt');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  
  // Rating Modal State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedTenantForRating, setSelectedTenantForRating] = useState<Tenant | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const navigate = useNavigate();

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page: pagination.page, limit: pagination.limit, sort: sortField };
      if (filterStatus !== 'All') params.status = filterStatus.toLowerCase();
      
      const { data } = await api.get('/tenants', { params });
      setTenants(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForRating) return;
    try {
      await api.post(`/tenants/${selectedTenantForRating._id}/rate`, {
        score: ratingScore,
        feedback: ratingFeedback
      });
      toast.success('Tenant rating saved');
      setRatingModalOpen(false);
      fetchTenants(); // refresh list to show score
    } catch (err) {
      toast.error('Failed to save rating');
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [pagination.page, filterStatus, sortField]);

  const filteredTenants = search
    ? tenants.filter(t => 
        t.firstName.toLowerCase().includes(search.toLowerCase()) || 
        t.lastName.toLowerCase().includes(search.toLowerCase()) ||
        t.property?.title.toLowerCase().includes(search.toLowerCase())
      )
    : tenants;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (tenant: Tenant) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      // 1. Create order
      const { data: orderData } = await api.post('/payments/create-order', {
        amount: tenant.rentAmount,
      });

      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.data.keyId;
      if (!rzpKey) {
        toast.error('Razorpay key is missing');
        return;
      }

      const options = {
        key: rzpKey,
        amount: orderData.data.amount,
        currency: 'INR',
        name: 'EstateOS',
        description: `Rent Payment for ${tenant.property?.title}`,
        order_id: orderData.data.id,
        handler: async function (response: any) {
          // 2. Verify payment
          try {
            await api.post('/payments/verify', {
              ...response,
              amount: tenant.rentAmount,
              tenantId: tenant._id,
              propertyId: tenant.property?._id
            });
            toast.success('Payment successful & transaction recorded!');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
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
      const paymentObject = new RazorpayConstructor(options);
      paymentObject.open();
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
    }
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
            Tenants
          </h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">{pagination.total} active leases</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/tenants/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.04 }}
        className="flex flex-col lg:flex-row gap-3 items-start lg:items-center"
      >
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-stone-light)]" />
          <input
            type="text"
            placeholder="Search tenants or properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] placeholder:text-[var(--color-stone-light)] focus:outline-none focus:border-[var(--color-champagne)]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1">
          {['All', 'Active', 'Past', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => { setFilterStatus(st); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-[var(--color-charcoal)] text-white'
                  : 'bg-white text-[var(--color-stone)] border border-[var(--color-mist)] hover:border-[var(--color-stone-light)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white rounded-xl border border-[var(--color-mist)] overflow-hidden flex flex-col"
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3.5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-[var(--color-cream)]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-[var(--color-cream)] rounded w-32" />
                  <div className="h-2.5 bg-[var(--color-cream)] rounded w-24" />
                </div>
                <div className="h-4 w-20 bg-[var(--color-cream)] rounded-md" />
              </div>
            ))}
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-3">
              <User className="w-7 h-7 text-[var(--color-stone-light)]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] mb-1.5">No tenants found</h3>
            <p className="text-[13px] text-[var(--color-stone)]">Your tenant records will appear here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_40px] gap-3 px-5 py-2.5 border-b border-[var(--color-mist)] bg-[var(--color-warm-white)]/70">
                <button
                  onClick={() => setSortField(f => f === 'firstName' ? '-firstName' : 'firstName')}
                  className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] text-left"
                >
                  Tenant <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">Property</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">Lease</span>
                <button
                  onClick={() => setSortField(f => f === '-rentAmount' ? 'rentAmount' : '-rentAmount')}
                  className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] text-left"
                >
                  Rent <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">Status</span>
                <span />
              </div>

              {/* Rows */}
              {filteredTenants.map((tenant, i) => (
                <motion.div
                  key={tenant._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_40px] gap-3 px-5 py-3 border-b border-[var(--color-mist)]/60 last:border-0 hover:bg-[var(--color-warm-white)]/50 transition-colors items-center group"
                >
                  {/* Tenant Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-cream)] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-[var(--color-champagne-dark)]">
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-[var(--color-charcoal)] truncate">
                          {tenant.firstName} {tenant.lastName}
                        </p>
                        {tenant.reputationScore !== undefined && (
                          <div className="flex items-center gap-0.5 text-orange-400 bg-orange-50 px-1.5 rounded text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-current" /> {tenant.reputationScore.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--color-stone)]">
                        <span className="flex items-center gap-0.5 truncate"><Mail className="w-3 h-3" /> {tenant.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="min-w-0">
                    <p className="text-[13px] text-[var(--color-charcoal)] truncate">{tenant.property?.title || 'Unknown Property'}</p>
                  </div>

                  {/* Lease Dates */}
                  <div className="min-w-0">
                    <p className="text-[12px] text-[var(--color-charcoal)]">{formatDate(tenant.leaseStart)}</p>
                    <p className="text-[10px] text-[var(--color-stone)] mt-0.5">to {formatDate(tenant.leaseEnd)}</p>
                  </div>

                  {/* Rent */}
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
                      ₹{tenant.rentAmount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[var(--color-stone)] mt-0.5">per month</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize leading-tight ${
                      tenant.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      tenant.status === 'past' ? 'bg-gray-100 text-gray-600' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        tenant.status === 'active' ? 'bg-emerald-500' :
                        tenant.status === 'past' ? 'bg-gray-400' :
                        'bg-amber-500'
                      }`} />
                      {tenant.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setActiveMenu(activeMenu === tenant._id ? null : tenant._id)}
                      className="p-1 rounded-md hover:bg-[var(--color-cream)] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4 text-[var(--color-stone)]" />
                    </button>
                    <AnimatePresence>
                      {activeMenu === tenant._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] overflow-hidden py-0.5 z-20"
                        >
                          <button className="w-full text-left px-3 py-1.5 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">View Profile</button>
                          <button className="w-full text-left px-3 py-1.5 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">Edit Details</button>
                          <div className="h-px bg-[var(--color-mist)] my-1" />
                          <button 
                            onClick={() => {
                              setSelectedTenantForRating(tenant);
                              setRatingScore(tenant.reputationScore || 5);
                              setRatingFeedback(tenant.reputationFeedback || '');
                              setRatingModalOpen(true);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-orange-500 hover:bg-orange-50 font-medium transition-colors"
                          >
                            <Star className="w-3.5 h-3.5" />
                            Rate Tenant
                          </button>
                          <button 
                            onClick={() => handlePayment(tenant)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--color-champagne-dark)] hover:bg-[var(--color-cream)] font-medium transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Rent (Test)
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const { data } = await api.get('/transactions', { params: { tenant: tenant._id } });
                                generateTenantLedger(tenant, data.data);
                                setActiveMenu(null);
                              } catch(err) {
                                toast.error('Failed to generate ledger');
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Ledger
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {tenants.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-mist)] mt-auto">
            <p className="text-[11px] text-[var(--color-stone)]">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-md border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-md border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Rate Tenant</h2>
                  <p className="text-[13px] text-[var(--color-stone)]">Evaluate {selectedTenantForRating?.firstName}</p>
                </div>
                <button onClick={() => setRatingModalOpen(false)} className="text-[var(--color-stone)] hover:bg-black/5 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRateTenant} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-2">Reputation Score (0-5)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" max="5" step="0.1"
                      value={ratingScore}
                      onChange={(e) => setRatingScore(parseFloat(e.target.value))}
                      className="w-full accent-[var(--color-champagne-dark)]"
                    />
                    <span className="text-[16px] font-bold text-[var(--color-charcoal)] w-8">{ratingScore.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Feedback</label>
                  <textarea 
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    rows={3}
                    placeholder="Notes on payment history, property care..."
                    className="w-full px-4 py-3 border border-[var(--color-mist)] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)] resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[var(--color-charcoal)] text-white text-[13px] font-bold rounded-xl mt-2 hover:bg-black transition-colors"
                >
                  Save Rating
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
