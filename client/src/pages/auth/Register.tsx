import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      setUser(data.data);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse bg-[var(--color-ivory)]">
      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link
          to="/"
          className="absolute top-8 right-8 flex items-center gap-3 group"
        >
          <span
            className="font-medium tracking-tight text-[var(--color-charcoal)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Estate<span className="font-light italic">OS</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="text-white text-xs font-semibold tracking-widest">
              E
            </span>
          </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto form-panel p-10"
        >
          <div className="mb-10">
            <h1 className="heading-card mb-3">Request Access</h1>
            <p className="text-[var(--color-stone)] font-[var(--font-body)]">
              Join the world's most exclusive real estate network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-lg text-sm border border-[var(--color-error)]/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-stone)] font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[var(--color-mist)] rounded-lg px-4 py-3 outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all font-[var(--font-body)]"
                placeholder="Eleanor Sterling"
              />
            </div>

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
                placeholder="eleanor@sterling.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-stone)] font-medium">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[var(--color-mist)] rounded-lg px-4 py-3 outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all font-[var(--font-body)]"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-stone)] font-medium">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-[var(--color-mist)] rounded-lg px-4 py-3 outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all font-[var(--font-body)] appearance-none"
              >
                <option value="user">Investor / Buyer</option>
                <option value="landlord">Portfolio Manager</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-charcoal)] text-white rounded-lg py-3.5 px-4 font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--color-charcoal-light)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-stone)] font-[var(--font-body)]">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-[var(--color-charcoal)] font-medium hover:text-[var(--color-champagne-dark)] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Left Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[var(--color-charcoal)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="glass-premium-dark p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-[var(--font-display)] mb-2">
              "An architectural triumph in software design."
            </h3>
            <p className="text-white/60 text-sm font-[var(--font-body)]">
              — Modern House
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
