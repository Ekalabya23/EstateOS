import { useEffect,  useState } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { X, Loader2 } from 'lucide-react';

interface VirtualTourProps {
  imageSrc: string;
  onClose: () => void;
}

export default function VirtualTour({ imageSrc, onClose }: VirtualTourProps) {
  const [loading, setLoading] = useState(true);

  // We rely on the viewer's built in loaders, but we can show a quick spinner
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex justify-between items-center p-6 text-white absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase">360° Virtual Tour</h2>
          <p className="text-sm text-white/70">Drag to look around</p>
        </div>
        <button 
          onClick={onClose}
          className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 w-full h-full relative flex items-center justify-center">
        {loading && (
          <div className="absolute flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-white mb-4" />
            <span className="text-white font-medium tracking-widest uppercase">Initializing Space...</span>
          </div>
        )}
        
        <ReactPhotoSphereViewer 
          src={imageSrc} 
          height={"100vh"} 
          width={"100vw"}
          littlePlanet={true}
          defaultZoomLvl={30}
          navbar={['autorotate', 'zoom', 'caption', 'fullscreen']}
        />
      </div>
    </div>
  );
}
