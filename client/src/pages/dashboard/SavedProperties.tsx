import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';

export default function SavedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      const { data } = await api.get('/users/saved');
      setProperties(data.data);
    } catch (err) {
      console.error('Failed to fetch saved properties', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveProperty = async (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    try {
      await api.post(`/users/saved/${propertyId}`);
      // Remove from list immediately
      setProperties(properties.filter(p => p._id !== propertyId));
    } catch (error) {
      console.error(error);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-champagne)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
          Saved Properties
        </h1>
        <p className="text-[var(--color-stone)]">Properties you have wishlisted.</p>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[var(--color-mist)] p-12 text-center flex flex-col items-center">
          <Heart className="w-12 h-12 text-[var(--color-mist)] mb-4" />
          <h3 className="text-lg font-bold text-[var(--color-charcoal)]">No saved properties yet</h3>
          <p className="text-[var(--color-stone)] mb-6">Browse our collection and save properties you love.</p>
          <button 
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-[var(--color-charcoal)] text-white font-bold rounded-xl hover:bg-black transition-colors"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/properties/${property._id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-[var(--color-mist)] hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-cream)]">
                <img 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-[var(--color-charcoal)]">
                    {formatCurrency(property.price)}
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleSaveProperty(e, property._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] truncate mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-[12px] text-[var(--color-stone)] mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{property.city}, {property.state}</span>
                </div>
                
                <div className="mt-auto flex items-center justify-between text-[12px] text-[var(--color-stone)] pt-3 border-t border-[var(--color-mist)]">
                  <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.bedrooms}</div>
                  <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.bathrooms}</div>
                  <div className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.area} sqft</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
