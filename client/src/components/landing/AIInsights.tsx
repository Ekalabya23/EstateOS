import { motion } from "framer-motion";
import { Brain, FileSearch, Languages, Sparkles, UsersRound } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Valuation intelligence",
    copy: "Blend comps, scarcity, rental history, and buyer demand into a price narrative your team can defend.",
  },
  {
    icon: FileSearch,
    title: "Document review",
    copy: "Surface obligations, renewals, encumbrances, and missing diligence items before they slow the deal.",
  },
  {
    icon: UsersRound,
    title: "Buyer matching",
    copy: "Pair private inventory with qualified buyers based on mandate, liquidity, geography, and intent.",
  },
  {
    icon: Languages,
    title: "Global presentation",
    copy: "Generate polished listing copy, owner summaries, and buyer packets for international conversations.",
  },
];

export default function AIInsights() {
  return (
    <section id="platform" className="section-dense bg-[var(--color-warm-white)]">
      <div className="container-cinematic">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="section-kicker">Intelligence Layer</span>
            <h2 className="heading-section mt-5">
              Built for the judgment calls behind premium real estate.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="rounded-[1.75rem] bg-[var(--color-charcoal)] p-6 text-white shadow-[var(--shadow-editorial)] md:p-8">
              <div className="mb-10 flex items-start justify-between gap-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-champagne)]">
                    AI Recommendation
                  </p>
                  <h3 className="mt-4 max-w-xl font-[var(--font-display)] text-3xl font-extrabold leading-tight">
                    Hold public launch. Send to 14 qualified private buyers first.
                  </h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[var(--color-charcoal)]">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {["Demand spike", "Low public supply", "Owner privacy"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/7 p-4">
                    <p className="text-sm font-bold">{item}</p>
                    <div className="mt-4 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-[var(--color-champagne)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="rounded-[1.35rem] border border-[var(--color-mist)] bg-white/76 p-6 shadow-[var(--shadow-subtle)]"
            >
              <feature.icon className="h-6 w-6 text-[var(--color-champagne-dark)]" />
              <h3 className="mt-8 font-[var(--font-display)] text-xl font-extrabold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-stone)]">{feature.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
