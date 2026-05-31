import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-charcoal)] flex flex-col items-center justify-center relative overflow-hidden text-white">
      <div className="absolute inset-0 architectural-grid-dark opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)] via-transparent to-transparent opacity-80" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center p-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md mb-8">
          <Building2 className="w-10 h-10 text-[var(--color-champagne-dark)]" />
        </div>
        
        <h1 className="text-8xl font-bold mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>404</h1>
        <h2 className="text-2xl font-semibold mb-6">The property you're looking for doesn't exist</h2>
        <p className="text-white/50 max-w-md mb-10 text-sm leading-relaxed">
          The page you are trying to access has been removed, relocated, or never existed in the EstateOS registry.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-champagne)] text-[var(--color-charcoal)] font-semibold rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </button>
      </motion.div>
    </div>
  );
}
