import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import QRCode from 'qrcode';
import api from '../../lib/axios';

interface PassportEvent {
  _id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  verifiedBy?: {
    firstName: string;
    lastName: string;
  };
}

interface Passport {
  _id: string;
  healthScore: number;
  lastInspectionDate: string;
  events: PassportEvent[];
}

export default function PropertyPassport({ propertyId }: { propertyId: string }) {
  const [passport, setPassport] = useState<Passport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const { data } = await api.get(`/properties/${propertyId}/passport`);
        setPassport(data.data);
        
        // Generate QR Code that points to this property URL
        const url = `${window.location.origin}/properties/${propertyId}`;
        const qr = await QRCode.toDataURL(url, {
          color: {
            dark: '#1a1a1a',
            light: '#00000000'
          },
          margin: 1
        });
        setQrCodeUrl(qr);
      } catch (err: any) {
        console.error('Failed to load property passport:', err);
        setError(err.message || 'Error fetching passport');
      } finally {
        setLoading(false);
      }
    };
    
    if (propertyId) {
      fetchPassport();
    }
  }, [propertyId]);

  if (loading) {
    return <div className="animate-pulse bg-white p-6 rounded-3xl h-64 border border-[var(--color-mist)]" />;
  }

  if (error) {
    return <div className="bg-red-50 text-red-500 p-6 rounded-3xl border border-red-100">Failed to load passport: {error}</div>;
  }

  if (!passport) return <div className="bg-gray-50 text-gray-500 p-6 rounded-3xl border border-gray-200">No passport data returned from server.</div>;

  return (
    <div className="mt-16 pt-16 border-t border-[var(--color-mist)]">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-[var(--color-mist)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-[var(--color-champagne-dark)]" />
            <h3 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
              Property Health Passport
            </h3>
          </div>
          <p className="text-[14px] text-[var(--color-stone)]">
            A verified timeline of all maintenance, inspections, and ownership transfers.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-1">Health Score</p>
            <div className="text-3xl text-[var(--color-charcoal)] font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {passport.healthScore ?? 100}/100
            </div>
          </div>
          {qrCodeUrl && (
            <div className="p-2 bg-white rounded-xl shadow-sm border border-[var(--color-mist)]">
              <img src={qrCodeUrl} alt="Property QR Code" className="w-16 h-16" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--color-mist)] before:via-[var(--color-mist)] before:to-transparent">
        {(passport.events || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
          <div key={event._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[var(--color-cream)] text-[var(--color-champagne-dark)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {event.type === 'inspection' ? <CheckCircle className="w-4 h-4" /> :
               event.type === 'maintenance' ? <AlertTriangle className="w-4 h-4" /> :
               <FileText className="w-4 h-4" />}
            </div>
            
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-[var(--color-mist)] bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col mb-1">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-champagne-dark)] font-semibold mb-1">
                  {event.type}
                </span>
                <span className="text-[12px] text-[var(--color-stone)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-[14px] font-bold text-[var(--color-charcoal)] mb-1">{event.title}</h4>
              <p className="text-[13px] text-[var(--color-stone)] leading-relaxed">{event.description}</p>
              
              {event.verifiedBy && (
                <div className="mt-3 pt-3 border-t border-[var(--color-mist)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--color-stone)]">
                      Verified by {event.verifiedBy.firstName} {event.verifiedBy.lastName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
