import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Building2, CircleDollarSign, TrendingUp } from "lucide-react";

const kpis = [
  { label: "Portfolio value", value: "$248.6M", delta: "+18.2%", icon: CircleDollarSign },
  { label: "Occupancy", value: "91%", delta: "+4.8%", icon: Building2 },
  { label: "Yield", value: "7.4%", delta: "+1.1%", icon: TrendingUp },
];

const feed = [
  ["Malabar Hill", "Buyer packet opened", "2m ago"],
  ["Palm Jumeirah", "Offer model updated", "14m ago"],
  ["Alibaug Estate", "Inspection scheduled", "1h ago"],
  ["Lutyens House", "NDA completed", "3h ago"],
];

export default function AnalyticsPreview() {
  return (
    <section id="analytics" className="section-dense relative overflow-hidden bg-[var(--color-charcoal-dark)] text-white">
      <div className="absolute inset-0 architectural-grid-dark opacity-25" />
      <div className="absolute inset-0 mesh-champagne opacity-30" />

      <div className="container-cinematic relative z-10">
        <div className="mb-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-6">
            <span className="section-kicker text-[var(--color-champagne)]">Portfolio Intelligence</span>
            <h2 className="heading-section mt-5">
              The numbers, narratives, and next moves in one room.
            </h2>
          </div>
          <div className="col-span-12 flex items-end lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-8 text-white/62">
              Replace scattered spreadsheets with a live operating view that tracks revenue, demand signals, due diligence, and owner decisions.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.06] shadow-[var(--shadow-cinematic)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-12">
            <div className="col-span-12 border-b border-white/10 p-5 md:p-7 lg:col-span-8 lg:border-b-0 lg:border-r">
              <div className="grid gap-4 md:grid-cols-3">
                {kpis.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                    <div className="mb-6 flex items-center justify-between">
                      <item.icon className="h-5 w-5 text-[var(--color-champagne)]" />
                      <span className="rounded-full bg-[var(--color-success)]/14 px-2.5 py-1 text-xs font-bold text-[var(--color-success)]">
                        {item.delta}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/42">{item.label}</p>
                    <p className="mt-2 text-3xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[var(--color-charcoal)]/46 p-5">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Revenue forecast</p>
                    <p className="mt-1 text-sm text-white/42">Trailing 12 months with projected deal flow</p>
                  </div>
                  <a href="/login" className="hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[var(--color-charcoal)] md:inline-flex">
                    Open dashboard
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="relative h-64 overflow-hidden rounded-xl bg-white/[0.04]">
                  <svg viewBox="0 0 900 260" className="h-full w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="estateArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#c4a46b" stopOpacity="0.38" />
                        <stop offset="100%" stopColor="#c4a46b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[40, 90, 140, 190, 240].map((y) => (
                      <line key={y} x1="0" x2="900" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />
                    ))}
                    <path
                      d="M0 218 C90 190 120 205 190 170 C260 134 315 170 380 118 C445 70 510 112 575 78 C640 44 700 74 760 42 C812 14 855 32 900 18 L900 260 L0 260 Z"
                      fill="url(#estateArea)"
                    />
                    <path
                      d="M0 218 C90 190 120 205 190 170 C260 134 315 170 380 118 C445 70 510 112 575 78 C640 44 700 74 760 42 C812 14 855 32 900 18"
                      fill="none"
                      stroke="#c4a46b"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-12 p-5 md:p-7 lg:col-span-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Live deal room</p>
                  <p className="mt-1 text-sm text-white/42">Private activity stream</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-success)]/14 text-[var(--color-success)]">
                  <Activity className="h-4 w-4" />
                </span>
              </div>

              <div className="space-y-3">
                {feed.map(([asset, action, time]) => (
                  <div key={`${asset}-${action}`} className="rounded-2xl border border-white/8 bg-white/[0.055] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-white">{asset}</p>
                      <p className="text-xs font-semibold text-white/36">{time}</p>
                    </div>
                    <p className="mt-1 text-sm text-white/54">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
