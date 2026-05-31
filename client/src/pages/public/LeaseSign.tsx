import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignaturePad from 'signature_pad';
import { FileSignature, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function LeaseSign() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pad, setPad] = useState<SignaturePad | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const signaturePad = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        penColor: '#1a1a1a'
      });
      setPad(signaturePad);

      // Resize canvas for high DPI
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvasRef.current!.width = canvasRef.current!.offsetWidth * ratio;
        canvasRef.current!.height = canvasRef.current!.offsetHeight * ratio;
        canvasRef.current!.getContext('2d')?.scale(ratio, ratio);
        signaturePad.clear();
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        signaturePad.off();
      };
    }
  }, []);

  const handleClear = () => {
    if (pad) pad.clear();
  };

  const handleSign = async () => {
    if (!pad || pad.isEmpty()) {
      return toast.error('Please provide a signature first');
    }

    setSubmitting(true);
    try {
      const signatureImageBase64 = pad.toDataURL();
      
      await api.post('/leases/sign', {
        tenantId,
        signatureImageBase64
      });

      setSuccess(true);
      toast.success('Lease signed successfully!');
      
      setTimeout(() => {
        navigate('/'); // Or to tenant dashboard if logged in
      }, 3000);

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign lease');
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Lease Officially Signed!
        </h1>
        <p className="text-[var(--color-stone)] max-w-md mx-auto mb-8">
          Your digital lease has been secured on the EstateOS ledger. A copy has been emailed to you and your landlord.
        </p>
        <p className="text-sm text-[var(--color-stone-light)] animate-pulse">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[var(--color-mist)] mx-auto mb-4">
          <FileSignature className="w-8 h-8 text-[var(--color-champagne-dark)]" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Execute Digital Lease
        </h1>
        <p className="text-[var(--color-stone)]">Please review your lease terms and sign below.</p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] overflow-hidden">
        {/* Mock Lease Terms Summary */}
        <div className="bg-[var(--color-charcoal)] p-6 md:p-8 text-white">
          <h2 className="text-xl font-bold mb-4 font-display">Lease Agreement Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-stone-light)] mb-1 uppercase tracking-wider text-[10px]">Property</p>
              <p className="font-semibold">Review PDF Before Signing</p>
            </div>
            <div>
              <p className="text-[var(--color-stone-light)] mb-1 uppercase tracking-wider text-[10px]">Duration</p>
              <p className="font-semibold">11 Months</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-sm text-[var(--color-stone)] mb-6">
            By signing below, you agree to all terms and conditions outlined in the official lease agreement document provided by your landlord. This digital signature is legally binding.
          </p>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[13px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider">
                Draw Your Signature
              </label>
              <button 
                onClick={handleClear}
                className="text-[12px] text-[var(--color-stone)] hover:text-[var(--color-charcoal)] underline"
              >
                Clear
              </button>
            </div>
            <div className="border-2 border-dashed border-[var(--color-mist-dark)] rounded-2xl overflow-hidden bg-[var(--color-warm-white)] h-64 relative">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
              <div className="absolute bottom-4 left-4 right-4 border-b border-gray-300 z-0 pointer-events-none" />
            </div>
          </div>

          <button 
            onClick={handleSign}
            disabled={submitting}
            className="w-full py-4 bg-[var(--color-champagne-dark)] text-white text-[15px] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-yellow-700 transition-colors disabled:opacity-50 shadow-lg shadow-yellow-900/20 uppercase tracking-widest"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {submitting ? 'Securing Signature...' : 'Sign & Complete Lease'}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-[var(--color-stone)]">
        Secured by EstateOS Digital Ledger
      </p>
    </div>
  );
}
