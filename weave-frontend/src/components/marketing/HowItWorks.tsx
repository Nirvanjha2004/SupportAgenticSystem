import { motion } from 'framer-motion'
import { Link2, Database, MessageCircle } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: Link2,
    title: 'Connect',
    body: 'One-click OAuth per source. Slack, Notion, and Google Docs — no exports or zip files.',
  },
  {
    n: '02',
    icon: Database,
    title: 'Ingest',
    body: 'A full backfill runs once, then live sync keeps every new message and edit current.',
  },
  {
    n: '03',
    icon: MessageCircle,
    title: 'Ask',
    body: 'Query in plain English from the Ask page. Every answer cites where it came from.',
  },
]

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#F5F1E8]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            How it works
          </span>
          <h2 className="mt-5 font-display text-heading font-semibold tracking-tight text-[#2B2A26] md:text-heading-md">
            From connected to answered{' '}
            <span className="relative inline-block">
              <span className="text-[#6D685F]">in minutes</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#DCCB9A]/60" />
            </span>
          </h2>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative mt-20">
          {/* Timeline line */}
          <div className="pointer-events-none absolute left-8 top-0 bottom-0 hidden w-px md:block">
            <div className="h-full w-full bg-gradient-to-b from-[#5E6B3F]/30 via-[#A8B18A]/20 to-transparent" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#5E6B3F] via-[#A8B18A] to-transparent"
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="space-y-20 md:space-y-24">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={stepVariants}
                className="relative grid gap-6 md:grid-cols-[72px_1fr] md:gap-10"
              >
                {/* Step indicator */}
                <div className="relative z-10 flex md:justify-center">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[#DDD5C8] bg-[#FBF9F5] shadow-soft">
                    <step.icon className="h-7 w-7 text-[#5E6B3F]" />
                  </div>
                  {/* Step number */}
                  <span className="absolute -right-1 -top-1 md:-right-2 md:-top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#DDD5C8] bg-[#FBF9F5] text-[10px] font-semibold text-[#6D685F]">
                    {step.n}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="font-display text-2xl font-semibold text-[#2B2A26]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-[#6D685F]">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
