import { ArrowRight, Calendar } from 'lucide-react';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'How to find verified tenants in 2026',
      excerpt: 'Learn the new standards for KYC and why background checks are no longer enough in the modern rental market.',
      date: 'May 28, 2026',
      category: 'Landlord Tips'
    },
    {
      id: 2,
      title: 'Tax benefits for landlords: A complete guide',
      excerpt: 'Maximize your rental yield by understanding deductions on maintenance, home loans, and depreciation.',
      date: 'May 15, 2026',
      category: 'Finance'
    },
    {
      id: 3,
      title: 'Rental yield in Mumbai vs Bangalore 2026',
      excerpt: 'An in-depth data analysis of top-performing micro-markets in India\'s biggest tech hubs.',
      date: 'April 30, 2026',
      category: 'Market Insights'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            EstateOS Insights
          </h1>
          <p className="text-lg text-[var(--color-stone)]">The latest news, tips, and market analysis for modern real estate.</p>
        </div>

        <div className="space-y-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-[var(--shadow-editorial)] group hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-champagne-dark)] bg-[var(--color-champagne-light)]/30 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[var(--color-stone)]">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-3 group-hover:text-[var(--color-champagne-dark)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                {post.title}
              </h2>
              
              <p className="text-[14px] text-[var(--color-stone)] leading-relaxed mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--color-charcoal)] group-hover:text-[var(--color-champagne-dark)] transition-colors">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
