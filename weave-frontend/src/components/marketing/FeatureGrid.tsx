import { motion } from 'framer-motion'
import { Zap, RefreshCw, Quote, ShieldCheck, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'One-click connectors',
    body: 'OAuth into Slack, Notion, and Google Docs. No exports, no zip files, no manual uploads.',
  },
  {
    icon: RefreshCw,
    title: 'Always in sync',
    body: 'Live webhooks keep your index current the moment a document or message changes.',
  },
  {
    icon: Quote,
    title: 'Answers with receipts',
    body: 'Every answer links back to the exact message or page it came from — no black box.',
  },
  {
    icon: ShieldCheck,
    title: 'Workspace-isolated',
    body: 'Each workspace is embedded and retrieved separately. Your data never crosses tenants.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function FeatureGrid() {
  return (
    <section id="features" className="relative bg-[#F5F1E8]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        {/* Section header - editorial left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            Built for real teams
          </span>
          <h2 className="mt-5 font-display text-heading font-semibold tracking-tight text-[#2B2A26] md:text-heading-md">
            Everything you need,{' '}
            <span className="relative inline-block">
              <span className="text-[#6D685F]">nothing to babysit</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#DCCB9A]/60" />
            </span>
          </h2>
        </motion.div>

        {/* Asymmetric bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16"
        >
          {/* First row - large + small */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Large feature highlight */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden md:col-span-2"
            >
              <div className="p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2E6D5]">
                  <Zap className="h-6 w-6 text-[#5E6B3F]" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-[#2B2A26]">
                  {FEATURES[0].title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-[#6D685F]">
                  {FEATURES[0].body}
                </p>
              </div>
              {/* Decorative bottom bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#5E6B3F]/20 via-[#A8B18A]/20 to-transparent" />
            </motion.div>

            {/* Small feature */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden"
            >
              <div className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2E6D5]">
                  <RefreshCw className="h-6 w-6 text-[#5E6B3F]" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-[#2B2A26]">
                  {FEATURES[1].title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6D685F]">
                  {FEATURES[1].body}
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#5E6B3F]/10 via-[#A8B18A]/10 to-transparent" />
            </motion.div>
          </div>

          {/* Second row - small + large */}
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {/* Small feature */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden"
            >
              <div className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2E6D5]">
                  <Quote className="h-6 w-6 text-[#5E6B3F]" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-[#2B2A26]">
                  {FEATURES[2].title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6D685F]">
                  {FEATURES[2].body}
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#5E6B3F]/10 via-[#A8B18A]/10 to-transparent" />
            </motion.div>

            {/* Large feature */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden md:col-span-2"
            >
              <div className="p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2E6D5]">
                  <ShieldCheck className="h-6 w-6 text-[#5E6B3F]" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-[#2B2A26]">
                  {FEATURES[3].title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-[#6D685F]">
                  {FEATURES[3].body}
                </p>
              </div>
              <div className="h-1.5 bg-gradient-to-r from-[#5E6B3F]/20 via-[#A8B18A]/20 to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#integrations"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#5E6B3F] transition-colors hover:text-[#49552F]"
          >
            See all integrations
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
