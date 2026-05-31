import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, CheckCircle2, Clock, AlertCircle, Wrench,  } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function Maintenance() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Resolution Form State
  const [status, setStatus] = useState('');
  const [contractor, setContractor] = useState('');
  const [cost, setCost] = useState(0);

  // New Ticket Form State (Tenant)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Plumbing');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Temporary: we assume the tenant has an active lease and we'll get the property ID from the backend eventually, or we fetch it. For now, we will fetch the tenant's lease on mount.
  const [myPropertyId, setMyPropertyId] = useState('');

  useEffect(() => {
    fetchTickets();
    if (user?.role === 'tenant') fetchMyLease();
  }, [user]);

  const fetchMyLease = async () => {
    try {
      const { data } = await api.get('/tenants/me');
      if (data.data) {
        setMyPropertyId(data.data.property._id);
      }
    } catch (err) {
      console.error('Failed to fetch lease', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/maintenance');
      setTickets(data.data);
    } catch (err) {
      console.error('Failed to fetch maintenance tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.patch(`/maintenance/${selectedTicket._id}`, {
        status,
        contractor,
        cost: Number(cost),
      });
      // Update local state
      setTickets(tickets.map(t => t._id === selectedTicket._id ? data.data : t));
      setSelectedTicket(null);
    } catch (err) {
      console.error('Failed to update ticket', err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/maintenance', {
        title: newTitle,
        description: newDesc,
        category: newCategory,
        priority: newPriority,
        property: myPropertyId,
        beforeImages: newImages
      });
      setTickets([data.data, ...tickets]);
      setShowNewTicketModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewImages([]);
    } catch (err) {
      console.error('Failed to create ticket', err);
      toast.error('Failed to create ticket');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewImages([...newImages, res.data.data]);
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-[var(--color-stone)] bg-[var(--color-mist)] border-[var(--color-mist)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'In-Progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Closed': return <CheckCircle2 className="w-4 h-4 text-[var(--color-stone)]" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-[var(--color-stone)]">Loading ticketing engine...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Main Ticket List (Linear Style) */}
      <div className={`flex-1 flex flex-col bg-white rounded-3xl border border-[var(--color-mist)] overflow-hidden transition-all duration-300 ${selectedTicket ? 'mr-6' : ''}`}>
        <div className="p-6 border-b border-[var(--color-mist)] flex justify-between items-center bg-white z-10">
          <div>
            <h1 className="text-2xl text-[var(--color-charcoal)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Maintenance Hub</h1>
            <p className="text-[13px] text-[var(--color-stone)]">Track and resolve property issues.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--color-stone)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="pl-9 pr-4 py-2 border border-[var(--color-mist)] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)] w-64"
              />
            </div>
            {user?.role === 'tenant' && (
              <button 
                onClick={() => setShowNewTicketModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
              >
                <Plus className="w-4 h-4" />
                Report Issue
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[var(--color-cream)] sticky top-0 z-10">
              <tr className="text-[var(--color-stone)] border-b border-[var(--color-mist)]">
                <th className="font-medium py-3 px-6 w-12">ID</th>
                <th className="font-medium py-3 px-6">Issue</th>
                <th className="font-medium py-3 px-6">Property</th>
                <th className="font-medium py-3 px-6">Priority</th>
                <th className="font-medium py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-mist)]">
              {tickets.map((ticket, idx) => (
                <tr 
                  key={ticket._id} 
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setStatus(ticket.status);
                    setContractor(ticket.contractor || '');
                    setCost(ticket.cost || 0);
                  }}
                  className="hover:bg-[var(--color-cream)]/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-6 text-[var(--color-stone-light)]">#{idx + 1001}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[var(--color-charcoal)] group-hover:text-[var(--color-champagne-dark)] transition-colors">
                      {ticket.title}
                    </div>
                    <div className="text-[var(--color-stone)] truncate w-64">{ticket.category}</div>
                  </td>
                  <td className="py-4 px-6 text-[var(--color-charcoal)] truncate max-w-[200px]">
                    {ticket.property?.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded border text-[11px] font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[var(--color-charcoal)] font-medium">
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--color-stone)]">
                    No maintenance tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Details */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ width: 0, opacity: 0, x: 50 }}
            animate={{ width: 400, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 50 }}
            className="bg-white rounded-3xl border border-[var(--color-mist)] overflow-hidden flex flex-col shrink-0"
          >
            <div className="p-6 border-b border-[var(--color-mist)] flex justify-between items-start bg-[var(--color-cream)]">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-2">Ticket Details</div>
                <h2 className="text-xl font-semibold text-[var(--color-charcoal)] leading-tight">{selectedTicket.title}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors text-[var(--color-stone)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div>
                <h3 className="text-[12px] font-semibold uppercase text-[var(--color-stone)] mb-2">Description</h3>
                <p className="text-[14px] text-[var(--color-charcoal)] leading-relaxed bg-[var(--color-warm-white)] p-4 rounded-xl border border-[var(--color-mist)]">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.beforeImages?.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold uppercase text-[var(--color-stone)] mb-2">Attached Media</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedTicket.beforeImages.map((img: string, i: number) => (
                      <img key={i} src={img} alt="Issue" className="h-24 w-24 object-cover rounded-xl border border-[var(--color-mist)] shrink-0" />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Reported By</div>
                  <div className="text-[14px] text-[var(--color-charcoal)] font-medium">{selectedTicket.tenant?.name || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Date</div>
                  <div className="text-[14px] text-[var(--color-charcoal)] font-medium">
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--color-mist)] pt-6">
                <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)] mb-4">Resolution Workflow</h3>
                {user?.role !== 'tenant' ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Status</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-mist)] rounded-xl text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                      >
                        <option value="Open">Open</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Assigned Contractor</label>
                      <input 
                        type="text" 
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        placeholder="e.g. Apex Plumbing Co."
                        className="w-full px-3 py-2 border border-[var(--color-mist)] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Resolution Cost (₹)</label>
                      <input 
                        type="number" 
                        value={cost}
                        onChange={(e) => setCost(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[var(--color-mist)] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-[var(--color-charcoal)] text-white text-[13px] font-bold rounded-xl mt-4 hover:bg-black transition-colors"
                    >
                      Update Ticket
                    </button>
                  </form>
                ) : (
                  <div className="bg-[var(--color-cream)] p-4 rounded-xl border border-[var(--color-mist)]">
                    <p className="text-[13px] text-[var(--color-stone)]">
                      Your landlord is currently reviewing this ticket. You will be notified when a contractor is assigned.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Report an Issue</h2>
                  <p className="text-[13px] text-[var(--color-stone)]">Submit a new maintenance ticket.</p>
                </div>
                <button onClick={() => setShowNewTicketModal(false)} className="text-[var(--color-stone)] hover:bg-black/5 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Title</label>
                  <input 
                    required
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Broken Pipe in Kitchen"
                    className="w-full px-4 py-3 border border-[var(--color-mist)] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Category</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--color-mist)] rounded-xl text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Security">Security</option>
                      <option value="Painting">Painting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Priority</label>
                    <select 
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--color-mist)] rounded-xl text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Description</label>
                  <textarea 
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 border border-[var(--color-mist)] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[var(--color-stone)] mb-1">Upload Photo (Optional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-[12px] text-[var(--color-stone)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-charcoal)] file:text-white hover:file:bg-black transition-colors"
                  />
                  {isUploading && <span className="text-[11px] text-[var(--color-champagne-dark)]">Uploading...</span>}
                  {newImages.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {newImages.map((img, i) => (
                        <img key={i} src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${img}`} alt="Upload" className="h-12 w-12 object-cover rounded-lg border border-[var(--color-mist)]" />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!myPropertyId}
                  className="w-full py-3.5 bg-[var(--color-charcoal)] text-white text-[13px] font-bold rounded-xl mt-4 hover:bg-black transition-colors disabled:opacity-50"
                >
                  Submit Ticket
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
