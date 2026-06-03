import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userData = data.data;
      setUser(userData);
      
      let defaultDashboard = "/dashboard";
      if (userData.role === 'tenant') defaultDashboard = "/dashboard/tenant";
      else if (userData.role === 'user') defaultDashboard = "/dashboard/investor";
      else if (userData.role === 'admin') defaultDashboard = "/dashboard/admin";

      const from = location.state?.from?.pathname || defaultDashboard;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-ivory)]">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="text-white text-xs font-semibold tracking-widest">
              E
            </span>
          </div>
          <span
            className="font-medium tracking-tight text-[var(--color-charcoal)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Estate<span className="font-light italic">OS</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto form-panel p-10"
        >
          <div className="mb-10">
            <h1 className="heading-card mb-3">Welcome back</h1>
            <p className="text-[var(--color-stone)] font-[var(--font-body)]">
              Enter your credentials to access your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-lg text-sm border border-[var(--color-error)]/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-stone)] font-medium">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[var(--color-mist)] rounded-lg px-4 py-3 outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all font-[var(--font-body)]"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[var(--color-stone)] font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--color-champagne)] hover:text-[var(--color-champagne-dark)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[var(--color-mist)] rounded-lg px-4 py-3 outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all font-[var(--font-body)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-charcoal)] text-white rounded-lg py-3.5 px-4 font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--color-charcoal-light)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-stone)] font-[var(--font-body)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--color-charcoal)] font-medium hover:text-[var(--color-champagne-dark)] transition-colors"
            >
              Request access
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[var(--color-charcoal)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="glass-premium-dark p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-[var(--font-display)] mb-2">
              "The gold standard for portfolio management."
            </h3>
            <p className="text-white/60 text-sm font-[var(--font-body)]">
              — Vogue Architecture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
