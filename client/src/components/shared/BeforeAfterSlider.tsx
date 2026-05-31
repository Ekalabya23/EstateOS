import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  stagedImage: string;
  altText?: string;
}

export default function BeforeAfterSlider({ originalImage, stagedImage, altText = "Virtual Staging" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', () => setIsDragging(false));
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-[var(--color-warm-white)] group select-none">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video cursor-ew-resize overflow-hidden"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* Original Image (Background) */}
        <img 
          src={originalImage} 
          alt={`${altText} Original`} 
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Staged Image (Foreground overlay) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={stagedImage} 
            alt={`${altText} Staged`} 
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: `${100 * (100 / sliderPosition)}%` }}
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] uppercase tracking-widest font-bold z-10 transition-opacity duration-300" style={{ opacity: sliderPosition > 10 ? 1 : 0 }}>
          Staged (AI)
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-[var(--color-charcoal)] text-[10px] uppercase tracking-widest font-bold z-10 transition-opacity duration-300" style={{ opacity: sliderPosition < 90 ? 1 : 0 }}>
          Original
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--color-champagne)]">
            <div className="w-1.5 h-4 border-l border-r border-[var(--color-mist-dark)] mx-auto flex items-center justify-center gap-1">
              <div className="w-px h-full bg-[var(--color-stone-light)]"></div>
            </div>
            <Sparkles className="absolute -top-6 -right-6 w-6 h-6 text-[var(--color-champagne-dark)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
