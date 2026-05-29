import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Activity, ChevronDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-[var(--color-ivory)]"
    >
      {/* Architectural grid — subtle, full bleed */}
      <div className="absolute inset-0 architectural-grid opacity-40 pointer-events-none" />

      {/* ── Main content row ── */}
      <div className="container-cinematic flex-1 flex items-center relative z-10 pt-32 pb-24">
        <div className="grid-12 w-full items-center gap-y-16">
          {/* LEFT: Typography */}
          <motion.div
            style={{ y: textY }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full border border-[var(--color-champagne)]/40 bg-[var(--color-champagne)]/8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)] animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--color-champagne-dark)]">
                EstateOS Enterprise 2.0
              </span>
            </motion.div>

            {/* Headline — each line clips independently for stagger reveal */}
            <h1 className="heading-cinematic">
              {["The Architecture", "of Tomorrow's", "Real Estate."].map(
                (line, i) => (
                  <div key={i} className="overflow-hidden leading-[0.95]">
                    <motion.span
                      className={`block ${i === 1 ? "italic font-light text-[var(--color-stone)]" : ""}`}
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.1 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {line}
                    </motion.span>
                  </div>
                ),
              )}
            </h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-elegant max-w-[420px]"
            >
              A cinematic operating system for the world's most exclusive
              property portfolios — merging AI with uncompromising aesthetic
              precision.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-5"
            >
              <button className="btn-cinematic">
                Deploy EstateOS
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="group flex items-center gap-3 text-[var(--color-charcoal)] font-medium text-sm tracking-wide hover:text-[var(--color-champagne-dark)] transition-colors duration-300">
                <span className="w-10 h-10 rounded-full border border-[var(--color-mist)] flex items-center justify-center group-hover:border-[var(--color-champagne)] transition-colors duration-300 shrink-0">
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                </span>
                Watch the Film
              </button>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex items-center gap-6 pt-2 border-t border-[var(--color-mist)]"
            >
              <span className="text-[11px] uppercase tracking-widest text-[var(--color-stone-light)] font-medium shrink-0">
                Trusted by
              </span>
              {["Vance & Co", "Sterling", "Azure"].map((name, i) => (
                <span
                  key={i}
                  className={`font-[var(--font-display)] text-[var(--color-charcoal)] ${i === 1 ? "text-base uppercase tracking-widest" : "text-lg italic"}`}
                >
                  {name}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Cinematic visual */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 relative">
            {/* Image container — fixed aspect ratio, no magic numbers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] lg:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[var(--shadow-cinematic)]"
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  scale: imageScale,
                  y: imageY,
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Live yield card — anchored to bottom-left with consistent padding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-72 glass-premium-dark rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-[11px] tracking-[0.18em] uppercase font-medium">
                    Live Yield
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--color-success)] text-[11px] font-bold bg-[var(--color-success)]/20 px-2.5 py-1 rounded-full border border-[var(--color-success)]/30">
                    <Activity className="w-3 h-3" />
                    +12.4%
                  </span>
                </div>
                <div className="text-3xl text-white font-light font-[var(--font-display)] mb-5">
                  $14.2M{" "}
                  <span className="text-white/40 text-sm font-[var(--font-body)]">
                    /mo
                  </span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "76%" }}
                    transition={{ duration: 2, delay: 1.6, ease: "easeOut" }}
                    className="h-full bg-[var(--color-champagne)] shadow-[0_0_8px_var(--color-champagne)]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="container-cinematic relative z-10 pb-8 flex justify-end"
      >
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-stone)]">
            Discover
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--color-charcoal)] group-hover:text-[var(--color-champagne)] transition-colors" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
