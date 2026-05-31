import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, UserCheck, Activity } from 'lucide-react';
import api from '../../lib/axios';

export default function AIInsights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    // Simulate an AI engine analyzing portfolio data
    const analyzeData = async () => {
      try {
        const [propRes, txRes] = await Promise.all([
          api.get('/properties'),
          api.get('/transactions/stats')
        ]);
        
        const properties = propRes.data.data;
        const txStats = txRes.data.data;
        
        // Call the real Gemini AI backend
        const aiRes = await api.post('/ai/insights', { properties, transactions: txStats });
        const generatedInsights = aiRes.data.data;

        // Map icons dynamically
        const iconMap: any = {
          AlertCircle,
          TrendingUp,
          Lightbulb,
          UserCheck,
          Sparkles
        };

        const mappedInsights = generatedInsights.map((insight: any) => ({
          ...insight,
          icon: iconMap[insight.icon] || Sparkles
        }));

        setInsights(mappedInsights);
        setLoading(false);

      } catch (err) {
        console.error('AI Engine failed', err);
        setLoading(false);
      }
    };
    analyzeData();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-champagne-dark)] mx-auto flex items-center justify-center shadow-lg shadow-[var(--color-champagne)]/30 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
          <Sparkles className="w-8 h-8 text-white relative z-10" />
        </div>
        <h1 className="text-3xl text-[var(--color-charcoal)] leading-none mb-3" style={{ fontFamily: 'var(--font-display)' }}>EstateOS Intelligence</h1>
        <p className="text-[14px] text-[var(--color-stone)] max-w-md mx-auto leading-relaxed">
          Your automated property management assistant. We analyze your portfolio data to deliver actionable insights.
        </p>
      </motion.div>

      {/* Insights Engine */}
      <div className="space-y-4">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 space-y-4">
            <Activity className="w-8 h-8 text-[var(--color-champagne)] animate-pulse" />
            <p className="text-[13px] text-[var(--color-stone)] animate-pulse">Analyzing portfolio data...</p>
          </motion.div>
        ) : (
          insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[var(--color-mist)] p-6 hover:shadow-[var(--shadow-editorial)] transition-all duration-300 flex gap-5 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                insight.type === 'warning' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' :
                insight.type === 'success' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' :
                insight.type === 'info' ? 'bg-[var(--color-cream)] text-[var(--color-champagne-dark)] group-hover:bg-[var(--color-champagne)]/20' :
                'bg-gray-50 text-gray-600 group-hover:bg-gray-100'
              }`}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] mb-2 tracking-tight">{insight.title}</h3>
                <p className="text-[13px] text-[var(--color-stone)] leading-relaxed max-w-2xl">{insight.desc}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
