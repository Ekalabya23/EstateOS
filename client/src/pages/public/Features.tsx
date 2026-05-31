import { Check, Minus } from 'lucide-react';

export default function Features() {
  const features = [
    { name: '100% Verified Listings', us: true, nobroker: false, magicbricks: false },
    { name: 'Digital Lease Signing', us: true, nobroker: true, magicbricks: false },
    { name: 'Fractional Ownership', us: true, nobroker: false, magicbricks: false },
    { name: 'AI Virtual Staging', us: true, nobroker: false, magicbricks: false },
    { name: 'Automated Rent Collection', us: true, nobroker: true, magicbricks: true },
    { name: 'Vendor Network Integration', us: true, nobroker: false, magicbricks: false },
    { name: 'Property Passport', us: true, nobroker: false, magicbricks: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Compare EstateOS
          </h1>
          <p className="text-lg text-[var(--color-stone)]">See why landlords and tenants prefer the modern standard.</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-editorial)] border border-[var(--color-mist)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-[var(--color-mist)] text-[11px] uppercase tracking-widest text-[var(--color-stone)] bg-gray-50/50 w-2/5">Feature</th>
                <th className="p-6 border-b border-[var(--color-mist)] text-center w-1/5 bg-[var(--color-champagne-light)]/30">
                  <span className="text-lg font-bold text-[var(--color-charcoal)] font-display">EstateOS</span>
                </th>
                <th className="p-6 border-b border-[var(--color-mist)] text-center text-[14px] font-bold text-[var(--color-stone)] w-1/5">NoBroker</th>
                <th className="p-6 border-b border-[var(--color-mist)] text-center text-[14px] font-bold text-[var(--color-stone)] w-1/5">MagicBricks</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={feat.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                  <td className="p-6 border-b border-[var(--color-mist)] text-[14px] font-medium text-[var(--color-charcoal)]">{feat.name}</td>
                  
                  <td className="p-6 border-b border-[var(--color-mist)] text-center bg-[var(--color-champagne-light)]/10">
                    {feat.us ? <Check className="w-5 h-5 mx-auto text-[var(--color-champagne-dark)]" /> : <Minus className="w-5 h-5 mx-auto text-[var(--color-mist-dark)]" />}
                  </td>
                  
                  <td className="p-6 border-b border-[var(--color-mist)] text-center">
                    {feat.nobroker ? <Check className="w-5 h-5 mx-auto text-emerald-600" /> : <Minus className="w-5 h-5 mx-auto text-[var(--color-mist-dark)]" />}
                  </td>
                  
                  <td className="p-6 border-b border-[var(--color-mist)] text-center">
                    {feat.magicbricks ? <Check className="w-5 h-5 mx-auto text-emerald-600" /> : <Minus className="w-5 h-5 mx-auto text-[var(--color-mist-dark)]" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
