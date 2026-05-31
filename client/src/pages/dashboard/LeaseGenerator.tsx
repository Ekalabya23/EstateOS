import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSignature, Shield, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  property: { _id: string; title: string };
  rentAmount: number;
}

export default function LeaseGenerator() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [addGuarantee, setAddGuarantee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      try {
        await api.get('/tenants', { params: { status: 'pending' } });
        // Let's just fetch all tenants for MVP, in a real app we'd filter for 'pending lease'
        const allTenants = await api.get('/tenants');
        setTenants(allTenants.data.data);
      } catch (err) {
        toast.error('Failed to fetch tenants');
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return toast.error('Please select a tenant');

    setGenerating(true);
    try {
      const { data } = await api.post('/leases/generate', {
        tenantId: selectedTenant,
        includeRentGuarantee: addGuarantee
      });

      // Show success and redirect to a page where the landlord can send the link to the tenant
      toast.success('Lease generated successfully!');
      
      // We will open the base64 PDF in a new tab for now
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(`<iframe width='100%' height='100%' src='${data.data}'></iframe>`);
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate lease');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-charcoal)] flex items-center justify-center text-[var(--color-champagne-dark)]">
          <FileSignature className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Digital Lease Generator
          </h1>
          <p className="text-[13px] text-[var(--color-stone)] mt-1">
            Create, protect, and send legally binding digital leases
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
        <form onSubmit={handleGenerate} className="space-y-8">
          
          {/* Tenant Selection */}
          <div>
            <label className="block text-[13px] font-bold text-[var(--color-charcoal)] mb-3">
              Select Tenant / Property
            </label>
            {loading ? (
              <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
            ) : (
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
                required
              >
                <option value="">-- Choose Tenant --</option>
                {tenants.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName} - {t.property?.title} (₹{t.rentAmount}/mo)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Rent Guarantee Upsell */}
          <div className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${addGuarantee ? 'border-[var(--color-champagne-dark)] bg-[var(--color-champagne-light)]/10' : 'border-[var(--color-mist)] bg-white hover:border-[var(--color-mist-dark)]'}`}
               onClick={() => setAddGuarantee(!addGuarantee)}>
            <div className="flex gap-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${addGuarantee ? 'bg-[var(--color-champagne-dark)] text-white' : 'border-2 border-[var(--color-stone-light)]'}`}>
                {addGuarantee && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className={`w-5 h-5 ${addGuarantee ? 'text-[var(--color-champagne-dark)]' : 'text-[var(--color-stone)]'}`} />
                  <h3 className="text-[15px] font-bold text-[var(--color-charcoal)]">Add Rent Guarantee Insurance</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-charcoal)] text-white text-[10px] uppercase tracking-wider font-semibold ml-2">Recommended</span>
                </div>
                <p className="text-[13px] text-[var(--color-stone)] leading-relaxed mb-3">
                  Protect your cash flow. If the tenant defaults, EstateOS covers up to 3 months of lost rent and handles the eviction process. Premium is automatically deducted from the first month's rent (3% of annual rent).
                </p>
                {addGuarantee && (
                  <div className="inline-block px-3 py-1.5 bg-white rounded-lg border border-[var(--color-champagne)] text-[12px] font-medium text-[var(--color-champagne-dark)]">
                    + Premium will be added to lease terms
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-mist)] flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl border border-[var(--color-mist)] text-[13px] font-bold text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={generating || !selectedTenant}
              className="px-6 py-3 rounded-xl bg-[var(--color-charcoal)] text-white text-[13px] font-bold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
            >
              {generating && <Loader2 className="w-4 h-4 animate-spin" />}
              Generate Legally Binding PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
