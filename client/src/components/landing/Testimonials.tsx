import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The first platform our brokers actually want open during client conversations.",
    name: "Eleanor Sterling",
    role: "Managing Director, Sterling Realty",
  },
  {
    quote: "EstateOS made our private inventory feel as premium as the assets themselves.",
    name: "Julian Vance",
    role: "CEO, Vance & Co Properties",
  },
  {
    quote: "We now manage owner updates, buyer rooms, and revenue signals without jumping between six tools.",
    name: "Sophia Chen",
    role: "Principal Broker, Azure Group",
  },
];

export default function Testimonials() {
  return (
    <section className="section-dense relative overflow-hidden bg-[var(--color-charcoal)] text-white">
      <div className="absolute inset-0 architectural-grid-dark opacity-20" />
      <div className="container-cinematic relative z-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="section-kicker text-[var(--color-champagne)]">Trusted by Private Teams</span>
            <h2 className="heading-section mt-5 max-w-4xl">
              Built for the people trusted with irreplaceable assets.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/52">
            Quiet software for brokers, principals, and operators who cannot afford noisy workflows.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="flex min-h-[300px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md"
            >
              <Quote className="h-7 w-7 text-[var(--color-champagne)]" />
              <p className="mt-8 text-2xl font-bold leading-tight">"{item.quote}"</p>
              <div className="mt-10 border-t border-white/10 pt-5">
                <p className="font-bold">{item.name}</p>
                <p className="mt-1 text-sm text-white/45">{item.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
