import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import VirtualTour from './VirtualTour';

interface PhotoGalleryProps {
  images: string[];
}

export default function PhotoGallery({ images = [] }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [virtualTourImage, setVirtualTourImage] = useState('');

  if (!images || images.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  const openVirtualTour = (e: React.MouseEvent, imgUrl: string) => {
    e.stopPropagation();
    setVirtualTourImage(imgUrl);
    setShowVirtualTour(true);
  };

  return (
    <>
      <div className="reveal-text mt-16 pt-16 border-t border-[var(--color-mist)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>Media Gallery</h3>
          <span className="text-[12px] text-[var(--color-stone)] uppercase tracking-widest">{images.length} Assets</span>
        </div>

        {/* Masonry-like Grid for first 5 images */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] rounded-3xl overflow-hidden">
          {/* Main Large Image */}
          <div 
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => setLightboxIndex(0)}
          >
            <img 
              src={images[0]} 
              alt="Property 1" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <button 
              onClick={(e) => openVirtualTour(e, images[0])}
              className="absolute bottom-6 left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
            >
              <Eye className="w-4 h-4" /> 360° View
            </button>
          </div>

          {/* Secondary Images */}
          {images.slice(1, 5).map((img, idx) => (
            <div 
              key={idx} 
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => setLightboxIndex(idx + 1)}
            >
              <img 
                src={img} 
                alt={`Property ${idx + 2}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* If it's the last slot and there are more images, show overlay */}
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-display font-medium">+{images.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <div className="absolute top-6 right-6 flex items-center gap-4">
              <button 
                onClick={(e) => openVirtualTour(e, images[lightboxIndex])}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" /> View in 360°
              </button>
              <button 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={images[lightboxIndex]}
              alt={`Gallery Image ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-8 text-white/50 text-sm font-mono tracking-widest">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {showVirtualTour && (
          <VirtualTour 
            imageSrc={virtualTourImage} 
            onClose={() => setShowVirtualTour(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
