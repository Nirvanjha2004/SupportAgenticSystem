import { motion } from 'framer-motion'

const COMPANIES = [
  'Northwind', 'Lumen Labs', 'Fieldstone', 'Arclight',
  'Greywolf', 'Basecamp Rd', 'Meridian', 'Summit',
]

const LOGOS_DUPLICATED = [...COMPANIES, ...COMPANIES]

export default function SocialProof() {
  return (
    <section className="relative bg-[#EEE7DA]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        {/* Companies marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            Trusted by support and ops teams at
          </p>

          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#EEE7DA] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#EEE7DA] to-transparent" />

            <div className="flex min-w-[200%] gap-20 animate-marquee">
              {LOGOS_DUPLICATED.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 font-display text-base font-semibold tracking-tight text-[#8A857D]/40 transition-colors hover:text-[#6D685F]/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonial — editorial card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-24 max-w-3xl"
        >
          <div className="card-sand p-10 md:p-14 relative grain">
            {/* Decorative large quote mark */}
            <div className="absolute -top-6 -left-2 md:-top-8 md:-left-4 select-none">
              <span className="font-serif text-[100px] leading-none text-[#DCCB9A]/60 md:text-[140px]">
                &ldquo;
              </span>
            </div>

            <blockquote className="relative z-10">
              <p className="font-display text-xl font-medium leading-relaxed text-[#2B2A26] md:text-2xl md:leading-[1.4]">
                We stopped losing answers in Slack threads. Now the whole team just asks Weave
                instead of pinging whoever remembers.
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E2E6D5] text-sm font-semibold text-[#5E6B3F]">
                  PS
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[#2B2A26]">
                    Priya Shah
                  </span>
                  <span className="block text-sm text-[#6D685F]">
                    Head of Support, Lumen Labs
                  </span>
                </div>
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
