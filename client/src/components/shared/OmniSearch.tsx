import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Building2, User, FileText, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

interface SearchResult {
  type: 'property' | 'user' | 'lease' | 'ticket';
  id: string;
  title: string;
  subtitle: string;
  badge: string;
}

export default function OmniSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search effect
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${query}`);
        setResults(res.data.data);
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building2 className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      case 'lease': return <FileText className="w-5 h-5" />;
      case 'ticket': return <Wrench className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on type
    if (result.type === 'property') {
      navigate(`/properties/${result.id}`);
    } else if (result.type === 'user') {
      navigate(`/dashboard/tenants`); // Or user detail
    } else if (result.type === 'ticket') {
      navigate(`/dashboard/maintenance`);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-mist)] bg-black/[0.02] hover:bg-black/[0.05] transition-colors text-sm text-[var(--color-stone)]"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-[var(--color-mist)] text-[10px] font-mono shadow-sm">
          <span className="text-[12px]">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-[101] overflow-hidden border border-[var(--color-mist)]"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-mist)]">
                <Search className="w-5 h-5 text-[var(--color-stone)]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search properties, tenants, tickets..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder-[var(--color-stone-light)]"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-black/[0.05]">
                  <X className="w-5 h-5 text-[var(--color-stone)]" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loading && (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-stone)]">
                    Searching the ecosystem...
                  </div>
                )}
                {!loading && query.length > 0 && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-stone)]">
                    No results found for "{query}"
                  </div>
                )}
                {!loading && results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-black/[0.03] text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-charcoal)] group-hover:scale-110 transition-transform">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-[var(--color-charcoal)] truncate">
                        {result.title}
                      </div>
                      <div className="text-[12px] text-[var(--color-stone)] truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    <div className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[var(--color-charcoal)] text-white">
                      {result.badge}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
