import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Brain, ScanText, Target, Sofa } from "lucide-react";

const cards = [
  {
    icon: Brain,
    title: "Predictive Valuation Engine",
    desc: "Analyzes millions of data points across global markets to predict property yields with 94% accuracy over 5 years.",
    span: "col-span-12 md:col-span-8",
    dark: false,
    accent: true,
  },
  {
    icon: ScanText,
    title: "Smart Contracts",
    desc: "Instant legal summaries and risk highlighting for 100-page lease agreements in seconds.",
    span: "col-span-12 md:col-span-4",
    dark: true,
    accent: false,
  },
  {
    icon: Target,
    title: "Client Matching",
    desc: "Behavioral targeting pairs off-market luxury units with verified high-net-worth buyers.",
    span: "col-span-12 md:col-span-4",
    dark: false,
    accent: false,
  },
  {
    icon: Sofa,
    title: "Generative Staging",
    desc: "Instantly restyle empty spaces with luxury designer furniture in one click.",
    span: "col-span-12 md:col-span-4",
    dark: false,
    accent: false,
  },
  {
    icon: Sparkles,
    title: "Dynamic Copy",
    desc: "Editorial-grade property descriptions generated in 12 languages simultaneously.",
    span: "col-span-12 md:col-span-4",
    dark: false,
    accent: false,
  },
];

export default function AIInsights() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="ai"
      ref={sectionRef}
      className="section-dense bg-[var(--color-ivory)] relative"
    >
      <div className="container-cinematic relative z-10">
        {/* ── Section header ── */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-[var(--color-champagne-dark)] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4 block">
            Artificial Intelligence
          </span>
          <h2 className="heading-section mb-5 leading-[1.05]">
            Cognitive{" "}
            <span className="italic font-light text-[var(--color-stone)]">
              Real Estate.
            </span>
          </h2>
          <p className="text-body-elegant text-base">
            The industry's first cognitive engine — predicting market shifts,
            automating contract analysis, and personalising client experiences
            at scale.
          </p>
        </div>

        {/* ── Bento grid — auto rows, no fixed heights ── */}
        <div className="grid-12 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`${card.span} relative overflow-hidden rounded-[1.75rem] p-8 glow-on-hover flex flex-col justify-between gap-10 min-h-[260px] ${
                card.dark ? "bg-[var(--color-charcoal)]" : "glass-premium"
              }`}
            >
              {/* Mesh accent for large card */}
              {card.accent && (
                <div className="absolute top-0 right-0 w-72 h-72 mesh-champagne rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              )}

              {/* Animated scan line for large card */}
              {card.accent && (
                <div className="absolute right-8 bottom-8 w-[28%] h-[45%] border-l border-t border-[var(--color-charcoal)]/10 pointer-events-none overflow-hidden">
                  <motion.div
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-px h-full bg-gradient-to-b from-transparent via-[var(--color-champagne)] to-transparent opacity-40"
                  />
                </div>
              )}

              {/* Icon */}
              <card.icon
                className={`w-7 h-7 ${
                  card.dark
                    ? "text-white/70"
                    : "text-[var(--color-champagne-dark)]"
                }`}
              />

              {/* Text */}
              <div>
                <h3
                  className={`font-[var(--font-display)] text-xl mb-3 leading-tight ${
                    card.dark ? "text-white" : "text-[var(--color-charcoal)]"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed max-w-[360px] ${
                    card.dark ? "text-white/55" : "text-[var(--color-stone)]"
                  }`}
                >
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
