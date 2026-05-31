import { Users, Globe, Shield, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-charcoal)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Building the operating system for real estate.
          </h1>
          <p className="text-xl text-[var(--color-stone)] leading-relaxed">
            EstateOS is on a mission to bring radical transparency, efficiency, and intelligence to the global rental market. We believe everyone deserves a seamless living experience.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[var(--color-mist)] bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Properties Managed', value: '10,000+' },
              { label: 'Verified Tenants', value: '45,000+' },
              { label: 'Rent Processed', value: '₹500Cr+' },
              { label: 'Cities Active', value: '12' }
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[var(--color-charcoal)] mb-1">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--color-stone)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Trust by Default', desc: 'We verify every user so you don\'t have to.' },
              { icon: Sparkles, title: 'Delightful UX', desc: 'Real estate software shouldn\'t feel like a spreadsheet.' },
              { icon: Globe, title: 'Accessible', desc: 'Breaking down barriers to finding the perfect home.' },
              { icon: Users, title: 'Community First', desc: 'Building neighborhoods, not just housing.' }
            ].map(value => (
              <div key={value.title} className="p-8 bg-white rounded-3xl border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
                <div className="w-12 h-12 bg-[var(--color-champagne-light)] rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-[var(--color-champagne-dark)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-charcoal)] mb-2">{value.title}</h3>
                <p className="text-[14px] text-[var(--color-stone)]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
