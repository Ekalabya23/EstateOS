import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Check, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import DocumentVault from '../../components/shared/DocumentVault';
import PhotoGallery from '../../components/shared/PhotoGallery';
import OwnershipLedger from '../../components/shared/OwnershipLedger';

gsap.registerPlugin(ScrollTrigger);

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data.data);
      } catch (err) {
        console.error('Failed to fetch property details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!loading && property) {
      // Hero Parallax
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Staggered text reveal
      gsap.fromTo(".reveal-text", 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, [loading, property]);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const handleTransaction = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCheckoutLoading(true);
    try {
      if (user.role === 'user') {
        // Investor Flow
        await api.post(`/properties/${property._id}/buy`);
        toast.success('Property Acquired! Redirecting to Portfolio...');
        setTimeout(() => navigate('/dashboard/investor'), 2000);
      } else if (user.role === 'tenant') {
        // Tenant Flow
        await api.post(`/properties/${property._id}/rent`);
        toast.success('Lease Activated! Redirecting to Dashboard...');
        setTimeout(() => navigate('/dashboard/tenant'), 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transaction failed');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm-white)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-champagne)]" />
      </div>
    );
  }

  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found.</div>;

  return (
    <div className="bg-[var(--color-warm-white)] min-h-screen text-[var(--color-charcoal)] font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button 
          onClick={() => navigate('/properties')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-[13px] font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>
      </nav>

      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-end pb-24 px-6 md:px-16 lg:px-24">
        <div className="absolute inset-0 z-0">
          <img 
            ref={imageRef}
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000'} 
            alt={property.title}
            className="w-full h-[130%] object-cover object-center -top-[15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
              {property.propertyType}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-[14px] md:text-[16px]">
              <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[var(--color-champagne)]" /> {property.city}, {property.state}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="text-[var(--color-champagne)] font-medium text-xl md:text-3xl">{formatCurrency(property.price)}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="relative z-20 bg-[var(--color-warm-white)] -mt-10 rounded-t-[40px] px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Details */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 border-y border-[var(--color-mist)]">
              <div className="reveal-text text-center">
                <Bed className="w-6 h-6 text-[var(--color-champagne-dark)] mx-auto mb-3" />
                <div className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>{property.bedrooms}</div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mt-1">Bedrooms</div>
              </div>
              <div className="reveal-text text-center border-l border-[var(--color-mist)]">
                <Bath className="w-6 h-6 text-[var(--color-champagne-dark)] mx-auto mb-3" />
                <div className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>{property.bathrooms}</div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mt-1">Bathrooms</div>
              </div>
              <div className="reveal-text text-center border-l border-[var(--color-mist)]">
                <Maximize className="w-6 h-6 text-[var(--color-champagne-dark)] mx-auto mb-3" />
                <div className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>{property.area}</div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mt-1">Square Feet</div>
              </div>
            </div>

            {/* Description */}
            <div className="reveal-text space-y-6">
              <h3 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>About this property</h3>
              <p className="text-[15px] leading-loose text-[var(--color-stone)] whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="reveal-text">
              <h3 className="text-2xl text-[var(--color-charcoal)] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Premium Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.amenities?.map((amenity: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] text-[var(--color-charcoal)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-cream)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--color-champagne-dark)]" />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Vault */}
            {(user?.role === 'admin' || user?.role === 'landlord' || user?._id === property.owner?._id) && (
              <div className="reveal-text mt-16 pt-16 border-t border-[var(--color-mist)]">
                <DocumentVault 
                  propertyId={property._id} 
                  initialDocuments={property.documents || []} 
                  readOnly={user?.role !== 'admin' && user?.role !== 'landlord' && user?._id !== property.owner?._id}
                />
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)] reveal-text">
              <h4 className="text-[12px] uppercase tracking-widest text-[var(--color-stone)] mb-2">Asking Price</h4>
              <div className="text-4xl text-[var(--color-charcoal)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {formatCurrency(property.price)}
              </div>
              
              <div className="space-y-4 mb-8">
                {(!user) ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-4 bg-[var(--color-charcoal)] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
                  >
                    Login to Invest / Rent
                  </button>
                ) : user.role === 'user' ? (
                  <button 
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-4 bg-[var(--color-champagne-dark)] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-700 transition-colors shadow-xl shadow-yellow-900/20"
                  >
                    Invest Now (Acquire Asset)
                  </button>
                ) : user.role === 'tenant' ? (
                  <button 
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-4 bg-[var(--color-charcoal)] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
                  >
                    Rent Now
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full py-4 bg-[var(--color-mist)] text-[var(--color-stone)] text-[13px] font-bold uppercase tracking-widest rounded-xl cursor-not-allowed"
                  >
                    Admins Cannot Transact
                  </button>
                )}
              </div>

              <div className="pt-6 border-t border-[var(--color-mist)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-cream)] flex items-center justify-center font-bold text-[var(--color-champagne-dark)]">
                    E
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[var(--color-charcoal)]">EstateOS Premier</div>
                    <div className="text-[12px] text-[var(--color-stone)]">Exclusive Listing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership & Tenant Ledger */}
            <div className="mt-8 reveal-text">
              <OwnershipLedger 
                ownershipHistory={property.ownershipHistory || []} 
                tenantHistory={property.tenantHistory || []} 
                transactions={property.transactions || []}
              />
            </div>
          </div>

        </div>

        {/* Media Gallery (Masonry) */}
        <PhotoGallery images={property.images || []} />

      </section>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md border border-[var(--color-mist)] shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCheckoutModal(false)} 
              className="absolute top-6 right-6 text-[var(--color-stone)] hover:bg-black/5 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Confirm Transaction
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[var(--color-warm-white)] p-4 rounded-xl border border-[var(--color-mist)]">
                <p className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Asset</p>
                <p className="text-[14px] font-semibold text-[var(--color-charcoal)]">{property.title}</p>
              </div>
              
              <div className="bg-[var(--color-warm-white)] p-4 rounded-xl border border-[var(--color-mist)] flex justify-between items-center">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-1">
                    {user?.role === 'user' ? 'Acquisition Cost' : 'First Month Rent (0.3%)'}
                  </p>
                  <p className="text-[18px] font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {user?.role === 'user' ? formatCurrency(property.price) : formatCurrency(Math.floor(property.price * 0.003))}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleTransaction}
              disabled={checkoutLoading}
              className="w-full py-4 bg-[var(--color-charcoal)] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex justify-center items-center gap-2"
            >
              {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {checkoutLoading ? 'Processing...' : 'Authorize Payment'}
            </button>
            <p className="text-[11px] text-center text-[var(--color-stone)] mt-4">
              Secure ledger transfer via EstateOS Vault
            </p>
          </motion.div>
        </div>
      )}
      
    </div>
  );
}
