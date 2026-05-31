import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Search, Loader2, Building2 } from 'lucide-react';
import api from '../../lib/axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PropertyListing() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get('/properties', { params: { status: 'available', limit: 50 } });
        setProperties(data.data);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const propertiesWithCoords = properties.filter(p => p.coordinates?.lat && p.coordinates?.lng);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="flex h-screen w-full bg-[var(--color-warm-white)] pt-[72px]">
      {/* Left Panel: Property Grid */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto px-6 py-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-[var(--color-charcoal)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Discover Luxury
            </h1>
            <p className="text-[14px] text-[var(--color-stone)]">
              Explore {properties.length} premium properties available in your area.
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone-light)]" />
            <input 
              type="text" 
              placeholder="Search by location, building name, or ZIP code" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--color-mist)] rounded-xl text-[13px] text-[var(--color-charcoal)] shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)] transition-all"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-champagne)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredProperty(property._id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  onClick={() => navigate(`/properties/${property._id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-[var(--color-mist)] hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-cream)]">
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-[var(--color-charcoal)]">
                      {formatCurrency(property.price)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] truncate mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[12px] text-[var(--color-stone)] mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{property.city}, {property.state}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[12px] text-[var(--color-stone)] pt-3 border-t border-[var(--color-mist)]">
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
      </div>

      {/* Right Panel: Map */}
      <div className="hidden lg:block lg:w-1/2 h-full relative bg-[var(--color-cream)]">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={{
              longitude: 72.8777,
              latitude: 19.0760,
              zoom: 11
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <NavigationControl position="top-right" />
            
            {propertiesWithCoords.map((property) => (
              <Marker 
                key={property._id} 
                longitude={property.coordinates.lng} 
                latitude={property.coordinates.lat}
              >
                <div 
                  className={`flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-all ${
                    hoveredProperty === property._id 
                      ? 'bg-[var(--color-charcoal)] text-white scale-110 z-10 px-3 py-1.5 font-bold' 
                      : 'bg-white text-[var(--color-charcoal)] border-2 border-[var(--color-champagne)] w-8 h-8'
                  }`}
                  onClick={() => navigate(`/properties/${property._id}`)}
                >
                  {hoveredProperty === property._id ? formatCurrency(property.price) : <Building2 className="w-4 h-4" />}
                </div>
              </Marker>
            ))}
          </Map>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-[var(--color-stone)]">
            <MapPin className="w-12 h-12 text-[var(--color-champagne)] mb-4" />
            <p>Please configure VITE_MAPBOX_TOKEN in .env to view the interactive map.</p>
          </div>
        )}
      </div>
    </div>
  );
}
