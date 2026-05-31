import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Home, FileText, Users, Bell, Shield, Wallet, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';

const landlordSteps = [
  { id: 1, title: 'Add your first property', icon: Home, desc: 'List your property to get started.' },
  { id: 2, title: 'Upload property documents', icon: FileText, desc: 'Securely vault your ownership proofs.' },
  { id: 3, title: 'Add your first tenant', icon: Users, desc: 'Invite a tenant to sign a digital lease.' },
  { id: 4, title: 'Set up rent reminders', icon: Bell, desc: 'Automate collection workflows.' }
];

const tenantSteps = [
  { id: 1, title: 'Complete your profile', icon: Shield, desc: 'Add emergency contact and details.' },
  { id: 2, title: 'Upload ID proof', icon: FileText, desc: 'Complete KYC to get verified.' },
  { id: 3, title: 'Review your lease', icon: Wallet, desc: 'Check terms and conditions.' },
  { id: 4, title: 'Set up autopay', icon: CreditCard, desc: 'Never miss a rent payment.' }
];

export default function Onboarding() {
  const { user, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = user?.role === 'landlord' ? landlordSteps : tenantSteps;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(curr => curr + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await api.post('/users/onboarding-complete');
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#1a1a1a', '#ffffff']
      });

      toast.success('Onboarding complete! Welcome to EstateOS.');
      await checkAuth(); // Refresh user state
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      toast.error('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-stone)]">
            Step {currentStep} of 4
          </span>
          <button onClick={handleSkip} className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-champagne-dark)] hover:underline">
            Skip for now
          </button>
        </div>
        <div className="h-2 w-full bg-[var(--color-mist)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[var(--color-charcoal)]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-champagne-light)]/20 rounded-bl-full -z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-[var(--color-cream)] border border-[var(--color-mist-dark)] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <CurrentIcon className="w-10 h-10 text-[var(--color-champagne-dark)]" />
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {steps[currentStep - 1].title}
            </h1>
            
            <p className="text-[15px] text-[var(--color-stone)] mb-10 max-w-sm">
              {steps[currentStep - 1].desc}
            </p>

            {/* Mock Action Area depending on step */}
            <div className="w-full max-w-md bg-[var(--color-warm-white)] p-6 rounded-2xl border border-[var(--color-mist)] mb-10">
              <p className="text-[13px] text-[var(--color-stone-light)] mb-4 italic">
                (For this demo, you can proceed without completing this step directly here. The full features are available in your dashboard.)
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={loading}
              className="w-full max-w-md py-4 bg-[var(--color-charcoal)] text-white text-[14px] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-black transition-colors uppercase tracking-widest shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : currentStep === 4 ? 'Complete Onboarding' : 'Continue'}
              {!loading && currentStep !== 4 && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        </AnimatePresence>

      </div>
      
      <p className="mt-8 text-[11px] text-[var(--color-stone-light)] uppercase tracking-widest">
        EstateOS Verified Network
      </p>
    </div>
  );
}
