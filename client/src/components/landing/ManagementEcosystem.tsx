import { motion } from "framer-motion";
import { FileSignature, Globe2, KeyRound, ShieldCheck } from "lucide-react";

const controls = [
  {
    icon: ShieldCheck,
    title: "Private permissions",
    copy: "Control what each broker, owner, buyer, and advisor can see before a conversation begins.",
  },
  {
    icon: FileSignature,
    title: "Diligence vault",
    copy: "Keep title documents, leases, inspection notes, and offer history connected to every asset.",
  },
  {
    icon: Globe2,
    title: "Market-ready packets",
    copy: "Create polished buyer rooms for domestic and international clients without rebuilding assets.",
  },
];

export default function ManagementEcosystem() {
  return (
    <section id="ecosystem" className="section-dense bg-[var(--color-ivory)]">
      <div className="container-cinematic">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="section-kicker">Control Layer</span>
            <h2 className="heading-section mt-5">
              A private operating system for people, documents, and decisions.
            </h2>
            <p className="mt-6 text-body-elegant">
              EstateOS keeps premium real estate work coordinated without making your team feel like they are inside accounting software.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65 }}
              className="relative overflow-hidden rounded-[1.75rem] bg-[var(--color-charcoal)] p-6 text-white shadow-[var(--shadow-editorial)] md:p-8"
            >
              <div
                className="absolute inset-0 opacity-34 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop")',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal)]/92 to-[var(--color-charcoal)]/52" />

              <div className="relative z-10">
                <div className="mb-14 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/44">Secure room</p>
                    <p className="mt-2 text-2xl font-black">Malabar Hill Residence</p>
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[var(--color-charcoal)]">
                    <KeyRound className="h-5 w-5" />
                  </span>
                </div>

                <div className="grid gap-3">
                  {["Owner view prepared", "Buyer NDA verified", "Legal packet shared"].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 p-4">
                      <span className="font-bold">{item}</span>
                      <span className="rounded-full bg-[var(--color-success)]/16 px-3 py-1 text-xs font-black text-[var(--color-success)]">
                        Live
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {controls.map((item) => (
            <div key={item.title} className="rounded-[1.35rem] border border-[var(--color-mist)] bg-white/70 p-6 shadow-[var(--shadow-subtle)]">
              <item.icon className="h-6 w-6 text-[var(--color-champagne-dark)]" />
              <h3 className="mt-8 font-[var(--font-display)] text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-stone)]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
