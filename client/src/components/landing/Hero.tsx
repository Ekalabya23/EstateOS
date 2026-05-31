import { motion } from "framer-motion";
import { ArrowRight, Building2, Play, ShieldCheck, TrendingUp } from "lucide-react";

const stats = [
  { value: "$1.8B", label: "Assets represented" },
  { value: "34", label: "Prime markets" },
  { value: "11.6%", label: "Yield lift" },
];

const portfolioSignals = [
  { icon: Building2, value: "82", label: "Homes" },
  { icon: TrendingUp, value: "7.4%", label: "Yield" },
  { icon: ShieldCheck, value: "A+", label: "Risk" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-charcoal)] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2400&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_12_11/0.92)_0%,rgb(12_12_11/0.72)_42%,rgb(12_12_11/0.22)_100%)]" />
      <div className="absolute inset-0 architectural-grid-dark opacity-20" />

      <div className="container-cinematic relative z-10 flex min-h-screen items-end pb-12 pt-32 md:items-center md:pb-0">
        <div className="grid w-full grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 max-w-4xl lg:col-span-7"
          >
            <span className="section-kicker text-[var(--color-champagne)]">Private Real Estate Command</span>
            <h1 className="heading-cinematic mt-7">
              Premium property operations, shaped for serious portfolios.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              EstateOS gives luxury brokers, family offices, and asset managers a single place to present residences,
              monitor performance, and move deals with discretion.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <a href="/register" className="btn-cinematic bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-champagne)]">
                Request Access
                <ArrowRight className="h-4 w-4" />
              </a>
              <button className="inline-flex min-h-[50px] items-center gap-3 rounded-2xl border border-white/16 bg-white/8 px-5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/14">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[var(--color-charcoal)]">
                  <Play className="ml-0.5 h-4 w-4" />
                </span>
                View Experience
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/9 p-4 backdrop-blur-md">
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/52">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 self-end lg:col-span-4 lg:col-start-9"
          >
            <div className="rounded-3xl border border-white/14 bg-[var(--color-charcoal)]/68 p-5 shadow-[var(--shadow-cinematic)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/44">Live portfolio</p>
                  <p className="mt-1 text-2xl font-black">$248.6M</p>
                </div>
                <span className="rounded-xl bg-[var(--color-success)]/18 px-3 py-2 text-sm font-black text-[var(--color-success)]">
                  +18%
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {portfolioSignals.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/8 p-3">
                    <item.icon className="h-4 w-4 text-[var(--color-champagne)]" />
                    <p className="mt-4 text-xl font-black">{item.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/44">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
