import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, CheckCircle, IndianRupee, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorQuote() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [quoteAmount, setQuoteAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('1');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // We would fetch the actual ticket details here using a public lookup endpoint
    // For MVP, we'll mock the fetching delay
    setTimeout(() => {
      setTicket({
        _id: ticketId,
        title: 'Leaking Pipe under kitchen sink',
        description: 'Water is dripping constantly. Needs urgent repair.',
        category: 'Plumbing',
        priority: 'Urgent',
        property: { title: '123 Residency Appts, Koramangala' }
      });
      setLoading(false);
    }, 1000);
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // We would normally POST to /api/v1/maintenance/:ticketId/quotes
      // with { vendorId, amount: quoteAmount, estimatedDays, notes }
      // For MVP simulation, just delay and show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast.success('Quote submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit quote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-champagne-dark)] animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Quote Submitted!
          </h2>
          <p className="text-[var(--color-stone)] leading-relaxed mb-6">
            Thank you. Your quote of <span className="font-bold text-[var(--color-charcoal)]">₹{quoteAmount}</span> has been sent to the property owner. You will be notified if your bid is accepted.
          </p>
          <button onClick={() => window.close()} className="px-6 py-3 bg-[var(--color-charcoal)] text-white font-bold rounded-xl text-[13px]">
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-charcoal)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-[var(--color-champagne-dark)]">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Submit Repair Quote
          </h1>
          <p className="text-[var(--color-stone)] mt-2">EstateOS Vendor Network</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-editorial)] border border-[var(--color-mist)]">
          {/* Ticket Details */}
          <div className="p-6 md:p-8 border-b border-[var(--color-mist)] bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-[var(--color-champagne-light)] text-[var(--color-champagne-dark)] rounded-full text-[10px] uppercase tracking-widest font-bold">
                {ticket.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-2">{ticket.title}</h2>
            <p className="text-[14px] text-[var(--color-stone)] mb-4">{ticket.description}</p>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--color-stone-light)]">
              <span>📍 {ticket.property.title}</span>
            </div>
          </div>

          {/* Quote Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">
                  Total Estimate (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="w-4 h-4 text-[var(--color-stone-light)]" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)] font-medium"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">
                  Estimated Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="w-4 h-4 text-[var(--color-stone-light)]" />
                  </div>
                  <select
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)] font-medium appearance-none"
                  >
                    <option value="1">Same Day</option>
                    <option value="2">1-2 Days</option>
                    <option value="3">3-5 Days</option>
                    <option value="7">1 Week</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">
                Additional Notes / Materials Needed
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)]"
                placeholder="List any parts you need to buy or constraints..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !quoteAmount}
              className="w-full py-4 bg-[var(--color-charcoal)] text-[var(--color-champagne-dark)] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 text-[14px] uppercase tracking-widest shadow-lg"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Binding Quote'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-[11px] text-[var(--color-stone-light)] uppercase tracking-widest">
          Powered by EstateOS Vendor Network
        </p>
      </div>
    </div>
  );
}
