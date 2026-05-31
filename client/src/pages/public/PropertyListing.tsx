import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Search, Loader2, Building2, SlidersHorizontal, X, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PropertyListing() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuthStore();
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  // Filters State
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    minArea: '',
    maxArea: '',
    city: '',
    sort: '-createdAt'
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: any = { status: 'available', limit: 50 };
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.minArea) params.minArea = filters.minArea;
      if (filters.maxArea) params.maxArea = filters.maxArea;
      if (filters.city) params.city = filters.city;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get('/properties', { params });
      setProperties(data.data);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    if (user) {
      api.get('/users/saved').then(res => {
        setSavedProperties(res.data.data);
      }).catch(console.error);
    }
  }, [user]);

  const toggleSaveProperty = async (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/users/saved/${propertyId}`);
      setSavedProperties(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const propertiesWithCoords = (properties || []).filter(p => p.coordinates?.lat && p.coordinates?.lng);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '', maxPrice: '', propertyType: '',
      bedrooms: '', minArea: '', maxArea: '',
      city: '', sort: '-createdAt'
    });
  };

  return (
    <div className="flex h-screen w-full bg-[var(--color-warm-white)] pt-[72px] overflow-hidden">
      
      {/* Sidebar Filters */}
      <AnimatePresence>
        {(showFilters || window.innerWidth >= 1024) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-[var(--color-mist)] pt-[72px] lg:pt-0 overflow-y-auto custom-scrollbar shadow-2xl lg:shadow-none flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-charcoal)]">Filters</h2>
                <button className="text-[12px] text-[var(--color-champagne-dark)] font-bold uppercase hover:underline" onClick={clearFilters}>
                  Clear All
                </button>
                <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-[var(--color-stone)]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-stone)] mb-2">City</label>
                  <select 
                    value={filters.city} 
                    onChange={e => handleFilterChange('city', e.target.value)}
                    className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm"
                  >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-stone)] mb-2">Property Type</label>
                  <select 
                    value={filters.propertyType} 
                    onChange={e => handleFilterChange('propertyType', e.target.value)}
                    className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-stone)] mb-2">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} className="w-1/2 p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm" />
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} className="w-1/2 p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-stone)] mb-2">Bedrooms</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '5+'].map(num => (
                      <button 
                        key={num}
                        onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? '' : num)}
                        className={`flex-1 py-2 text-xs font-bold border rounded-lg transition-colors ${filters.bedrooms === num ? 'bg-[var(--color-charcoal)] text-white border-[var(--color-charcoal)]' : 'bg-white text-[var(--color-stone)] border-[var(--color-mist)] hover:border-[var(--color-charcoal)]'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-stone)] mb-2">Sort By</label>
                  <select 
                    value={filters.sort} 
                    onChange={e => handleFilterChange('sort', e.target.value)}
                    className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="area-desc">Area: Largest First</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content: Property Grid */}
      <div className="flex-1 h-full overflow-y-auto px-4 md:px-6 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl text-[var(--color-charcoal)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Discover Luxury
              </h1>
              <p className="text-[14px] text-[var(--color-stone)]">
                Showing {properties.length} results
              </p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[var(--color-mist)] rounded-lg text-sm font-semibold text-[var(--color-charcoal)] shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone-light)]" />
            <input 
              type="text" 
              placeholder="Search by building name or ZIP code..." 
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
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProperty(property._id)}
                  onMouseLeave={() => setHoveredProperty(null)}
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
                      <Heart className={`w-4 h-4 ${savedProperties.includes(property._id) ? 'fill-rose-500 text-rose-500' : 'text-[var(--color-charcoal)]'}`} />
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
                    
                    <div className="mt-auto flex items-center gap-4 text-[12px] text-[var(--color-stone)] pt-3 border-t border-[var(--color-mist)]">
                      <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.bedrooms}</div>
                      <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.bathrooms}</div>
                      <div className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-[var(--color-champagne-dark)]" /> {property.area} sqft</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {properties.length === 0 && (
                <div className="col-span-full py-12 text-center text-[var(--color-stone)]">
                  No properties found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="hidden xl:block xl:w-[400px] 2xl:w-[500px] h-full relative bg-[var(--color-cream)] flex-shrink-0 border-l border-[var(--color-mist)]">
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
            <p className="text-sm">Please configure VITE_MAPBOX_TOKEN in .env to view the interactive map.</p>
          </div>
        )}
      </div>
    </div>
  );
}
