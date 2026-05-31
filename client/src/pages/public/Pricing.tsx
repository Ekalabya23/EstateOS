import { Check } from 'lucide-react';

export default function Pricing() {
  const tiers = [
    {
      name: 'Tenant',
      price: 'Free',
      description: 'Everything a tenant needs to find and manage their home.',
      features: ['Browse Verified Listings', 'Digital Lease Signing', 'Maintenance Requests', 'Rent Autopay via UPI'],
      cta: 'Sign Up Free',
      highlighted: false
    },
    {
      name: 'Landlord Pro',
      price: '₹999',
      period: '/month',
      description: 'For landlords managing up to 10 properties.',
      features: ['Unlimited Tenant Invites', 'Automated Rent Collection', 'AI Virtual Staging', 'Vendor Network Access', 'Legal Lease Generation'],
      cta: 'Start 14-Day Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For property management companies and large portfolios.',
      features: ['Unlimited Properties', 'White-label Dashboard', 'Dedicated Account Manager', 'Custom API Integrations'],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[var(--color-stone)] max-w-2xl mx-auto">
            Whether you're looking for a home or managing a portfolio, EstateOS has a plan that scales with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`rounded-3xl p-8 relative flex flex-col ${
                tier.highlighted 
                  ? 'bg-[var(--color-charcoal)] text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-[var(--color-champagne-dark)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-[var(--color-charcoal)]'}`}>{tier.name}</h3>
              <p className={`text-[13px] mb-6 min-h-[40px] ${tier.highlighted ? 'text-gray-300' : 'text-[var(--color-stone)]'}`}>{tier.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className={`text-[13px] ${tier.highlighted ? 'text-gray-300' : 'text-[var(--color-stone)]'}`}>{tier.period}</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-[var(--color-champagne)]' : 'text-[var(--color-champagne-dark)]'}`} />
                    <span className={`text-[14px] ${tier.highlighted ? 'text-gray-200' : 'text-[var(--color-charcoal)]'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] transition-colors ${
                tier.highlighted 
                  ? 'bg-[var(--color-champagne-dark)] text-white hover:bg-yellow-700' 
                  : 'bg-[var(--color-warm-white)] text-[var(--color-charcoal)] border border-[var(--color-mist-dark)] hover:bg-[var(--color-mist)]'
              }`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
