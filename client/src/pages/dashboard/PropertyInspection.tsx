import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Plus, Trash2, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

interface Property {
  _id: string;
  title: string;
}

export default function PropertyInspection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [type, setType] = useState('move-in');
  const [overallCondition, setOverallCondition] = useState('');
  
  const [rooms, setRooms] = useState([
    { name: 'Living Room', items: [{ name: 'Walls', condition: 'good', notes: '' }] }
  ]);
  
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get('/properties');
        setProperties(data.data);
      } catch (err) {
        toast.error('Failed to load properties');
      }
    };
    fetchProperties();
  }, []);

  const handleAddRoom = () => {
    setRooms([...rooms, { name: 'New Room', items: [{ name: 'General', condition: 'good', notes: '' }] }]);
  };

  const handleAddItem = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].items.push({ name: 'New Item', condition: 'good', notes: '' });
    setRooms(newRooms);
  };

  const handleRemoveRoom = (index: number) => {
    const newRooms = [...rooms];
    newRooms.splice(index, 1);
    setRooms(newRooms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return toast.error('Please select a property');

    setSubmitting(true);
    try {
      await api.post(`/properties/${selectedProperty}/inspections`, {
        type,
        rooms,
        overallCondition
      });

      toast.success('Inspection Report Submitted!');
      navigate('/dashboard/properties');
    } catch (err) {
      toast.error('Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-charcoal)] flex items-center justify-center text-[var(--color-champagne-dark)]">
          <ClipboardCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Property Inspection
          </h1>
          <p className="text-[13px] text-[var(--color-stone)] mt-1">
            Conduct standardized move-in, move-out, or routine condition audits
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Property</label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
              required
            >
              <option value="">Select Property...</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Inspection Type</label>
            <div className="flex bg-[var(--color-warm-white)] p-1 rounded-xl border border-[var(--color-mist)]">
              {['move-in', 'move-out', 'routine'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-[13px] font-medium rounded-lg capitalize transition-colors ${type === t ? 'bg-white text-[var(--color-charcoal)] shadow-sm' : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)]'}`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Checklist */}
        <div className="space-y-6">
          {rooms.map((room, rIdx) => (
            <div key={rIdx} className="bg-white rounded-3xl p-6 border border-[var(--color-mist)] shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-mist)]">
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => {
                    const newRooms = [...rooms];
                    newRooms[rIdx].name = e.target.value;
                    setRooms(newRooms);
                  }}
                  className="text-xl font-bold text-[var(--color-charcoal)] bg-transparent focus:outline-none focus:border-b border-[var(--color-champagne)] font-display"
                />
                <button type="button" onClick={() => handleRemoveRoom(rIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {room.items.map((item, iIdx) => (
                  <div key={iIdx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-[var(--color-warm-white)]/50 p-4 rounded-xl border border-[var(--color-mist)]">
                    
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Item</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          newRooms[rIdx].items[iIdx].name = e.target.value;
                          setRooms(newRooms);
                        }}
                        className="w-full bg-transparent border-b border-[var(--color-mist-dark)] focus:border-[var(--color-champagne)] text-[14px] py-1 focus:outline-none"
                      />
                    </div>
                    
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Condition</label>
                      <select
                        value={item.condition}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          newRooms[rIdx].items[iIdx].condition = e.target.value;
                          setRooms(newRooms);
                        }}
                        className="w-full bg-white border border-[var(--color-mist)] rounded-lg text-[13px] py-1.5 px-2 focus:outline-none focus:border-[var(--color-champagne)]"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-[10px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Notes</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          newRooms[rIdx].items[iIdx].notes = e.target.value;
                          setRooms(newRooms);
                        }}
                        placeholder="Any damages or comments..."
                        className="w-full bg-white border border-[var(--color-mist)] rounded-lg text-[13px] py-1.5 px-3 focus:outline-none focus:border-[var(--color-champagne)]"
                      />
                    </div>

                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                      <button type="button" className="p-2 text-[var(--color-stone)] hover:text-[var(--color-champagne-dark)] transition-colors" title="Add Photo">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => handleAddItem(rIdx)}
                className="mt-4 flex items-center gap-2 text-[12px] font-bold text-[var(--color-champagne-dark)] hover:text-yellow-700 uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRoom}
            className="w-full py-4 border-2 border-dashed border-[var(--color-mist-dark)] rounded-3xl text-[14px] font-bold text-[var(--color-stone)] hover:bg-white hover:border-[var(--color-champagne)] hover:text-[var(--color-champagne-dark)] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Another Room
          </button>
        </div>

        {/* Final Sign-off */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
          <label className="block text-[12px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Overall Summary & Comments</label>
          <textarea
            value={overallCondition}
            onChange={(e) => setOverallCondition(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[14px] focus:outline-none focus:border-[var(--color-champagne)] transition-colors mb-6"
            placeholder="Summarize the overall condition of the property..."
          />
          
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl border border-[var(--color-mist)] text-[13px] font-bold text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting || !selectedProperty}
              className="px-6 py-3 rounded-xl bg-[var(--color-charcoal)] text-white text-[13px] font-bold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save to Property Passport
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
