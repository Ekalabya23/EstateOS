import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  ImageIcon,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import api from '../../lib/axios';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const amenityOptions = [
  'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security',
  'Elevator', 'Balcony', 'Terrace', 'Smart Home', 'Concierge',
  'Spa', 'Wine Cellar', 'Home Theater', 'Staff Quarters',
];

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [] as string[],
    images: [] as string[],
    featured: false,
  });

  const [imageUrl, setImageUrl] = useState('');

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addImage = () => {
    if (imageUrl.trim() && !form.images.includes(imageUrl.trim())) {
      setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
      setImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area),
      };

      await api.post('/properties', payload);
      navigate('/dashboard/properties');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create property. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg bg-white border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] placeholder:text-[var(--color-stone-light)] focus:outline-none focus:border-[var(--color-champagne)]/50 focus:ring-1 focus:ring-[var(--color-champagne)]/10 transition-all';
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
          onClick={() => navigate('/dashboard/properties')}
          className="p-1.5 rounded-lg border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-stone)]" />
        </button>
        <div>
          <h1 className="text-xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Add Property
          </h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">List a new property in your portfolio</p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[13px]"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Basic Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="bg-white rounded-xl border border-[var(--color-mist)] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Basic Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Property Title</label>
              <input type="text" className={inputClass} placeholder="e.g. The Azure Penthouse" required value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Describe the property..." required value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Property Type</label>
                <select className={inputClass} value={form.propertyType} onChange={(e) => updateField('propertyType', e.target.value)}>
                  {propertyTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Area (sqft)</label>
                <input type="number" className={inputClass} placeholder="3800" required value={form.area} onChange={(e) => updateField('area', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <input type="number" className={inputClass} placeholder="4" value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <input type="number" className={inputClass} placeholder="3" value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Location ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-xl border border-[var(--color-mist)] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Location</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Street Address</label>
              <input type="text" className={inputClass} placeholder="123 Luxury Lane" required value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" className={inputClass} placeholder="Mumbai" required value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" className={inputClass} placeholder="Maharashtra" required value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <input type="text" className={inputClass} placeholder="400001" value={form.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Pricing ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-xl border border-[var(--color-mist)] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Pricing</h2>
          </div>

          <div>
            <label className={labelClass}>Price (₹)</label>
            <input type="number" className={inputClass} placeholder="85000000" required value={form.price} onChange={(e) => updateField('price', e.target.value)} />
            <p className="text-[11px] text-[var(--color-stone-light)] mt-1">Enter the price in INR (e.g. 85000000 for ₹8.5 Cr)</p>
          </div>
        </motion.div>

        {/* ── Images ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-xl border border-[var(--color-mist)] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)]">Images</h2>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="url"
              className={`${inputClass} flex-1`}
              placeholder="Paste image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-2 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-champagne)]/10 text-[var(--color-champagne-dark)] transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[var(--color-mist)] group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Amenities ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-[var(--color-mist)] p-5"
        >
          <h2 className="text-[15px] font-semibold text-[var(--color-charcoal)] mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-1.5">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  form.amenities.includes(amenity)
                    ? 'bg-[var(--color-charcoal)] text-white'
                    : 'bg-[var(--color-warm-white)] text-[var(--color-stone)] border border-[var(--color-mist)] hover:border-[var(--color-stone-light)]'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="flex items-center justify-between pt-2 pb-4"
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard/properties')}
            className="px-5 py-2.5 rounded-lg border border-[var(--color-mist)] text-[13px] font-medium text-[var(--color-stone)] hover:bg-[var(--color-warm-white)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
