import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

const properties = [
  {
    title: "Palm Jumeirah Sky Villa",
    location: "Dubai, UAE",
    price: "$18.4M",
    meta: "6 suites / private lift / marina view",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2200&auto=format&fit=crop",
    size: "lg:col-span-7",
  },
  {
    title: "Alibaug Estate",
    location: "Maharashtra, India",
    price: "$7.2M",
    meta: "9 acres / wellness pavilion",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2200&auto=format&fit=crop",
    size: "lg:col-span-5",
  },
  {
    title: "Lutyens House",
    location: "New Delhi, India",
    price: "$11.8M",
    meta: "heritage block / secured compound",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2200&auto=format&fit=crop",
    size: "lg:col-span-5",
  },
  {
    title: "Malabar Hill Residence",
    location: "Mumbai, India",
    price: "$22.6M",
    meta: "sea-facing / club floor / 11,000 sqft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2200&auto=format&fit=crop",
    size: "lg:col-span-7",
  },
];

export default function PropertyShowcase() {
  return (
    <section id="portfolio" className="section-dense bg-[var(--color-ivory)]">
      <div className="container-cinematic">
        <div className="mb-10 grid grid-cols-12 gap-6 md:mb-14">
          <div className="col-span-12 lg:col-span-7">
            <span className="section-kicker">Signature Residences</span>
            <h2 className="heading-section mt-5 max-w-3xl">
              Designed to sell the address before the first conversation.
            </h2>
          </div>
          <div className="col-span-12 flex items-end lg:col-span-4 lg:col-start-9">
            <p className="text-body-elegant">
              Rich media, financial context, owner notes, and buyer-ready details live together in a polished private inventory.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {properties.map((property, index) => (
            <motion.article
              key={property.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group col-span-12 ${property.size} overflow-hidden rounded-[1.6rem] bg-[var(--color-charcoal)] shadow-[var(--shadow-editorial)]`}
            >
              <div className="relative h-[420px] overflow-hidden md:h-[520px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[var(--ease-fluid)] group-hover:scale-105"
                  style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-charcoal)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--color-champagne-dark)]" />
                  {property.location}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="mb-4 flex items-center justify-between border-b border-white/14 pb-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/50">{property.meta}</p>
                    <p className="text-xl font-black text-white">{property.price}</p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="max-w-xl font-[var(--font-display)] text-3xl font-extrabold leading-none text-white md:text-5xl">
                      {property.title}
                    </h3>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[var(--color-charcoal)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
