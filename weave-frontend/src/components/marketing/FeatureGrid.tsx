import { motion } from 'framer-motion';
import { Zap, RefreshCw, Quote, ShieldCheck, ArrowRight, ChevronRight, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'One-click connectors',
    body: 'OAuth into Slack, Notion, and Google Docs. No exports, no zip files, no manual uploads.',
    gradient: 'from-[#E2E6D5] to-[#F5F1E8]',
  },
  {
    icon: RefreshCw,
    title: 'Always in sync',
    body: 'Live webhooks keep your index current the moment a document or message changes.',
    gradient: 'from-[#DCCB9A]/20 to-[#F5F1E8]',
  },
  {
    icon: Quote,
    title: 'Answers with receipts',
    body: 'Every answer links back to the exact message or page it came from — no black box.',
    gradient: 'from-[#A8B18A]/20 to-[#F5F1E8]',
  },
  {
    icon: ShieldCheck,
    title: 'Workspace-isolated',
    body: 'Each workspace is embedded and retrieved separately. Your data never crosses tenants.',
    gradient: 'from-[#5E6B3F]/10 to-[#F5F1E8]',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeatureGrid() {
  return (
    <section id="features" className="relative bg-[#F5F1E8] py-24 md:py-32">
      <div className="divider-organic-thick" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#5E6B3F]/20 bg-[#E2E6D5]/50 px-4 py-1.5 mb-6">
            <Check className="h-3.5 w-3.5 text-[#5E6B3F]" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#5E6B3F]">
              Built for real teams
            </span>
          </span>
          <h2 className="font-display text-heading font-bold tracking-tight text-[#2B2A26] md:text-heading-lg">
            Everything you need,{' '}
            <span className="relative inline-block text-[#5E6B3F]">
              nothing to babysit
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5E6B3F] via-[#DCCB9A] to-[#A8B18A] rounded-full" />
            </span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-0"
        >
          {/* First row */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Large feature 1 */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden md:col-span-2 group"
            >
              <div className={`p-8 md:p-10 bg-gradient-to-br ${FEATURES[0].gradient}`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5E6B3F] shadow-warm-lg group-hover:scale-105 transition-transform duration-400">
                  <Zap className="h-8 w-8 text-[#FBF9F5]" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-bold text-[#2B2A26]">
                  {FEATURES[0].title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6D685F]">
                  {FEATURES[0].body}
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#5E6B3F] opacity-0 group-hover:opacity-100 transform translate-x-[-12px] group-hover:translate-x-0 transition-all duration-500">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            {/* Small feature 1 */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden group"
            >
              <div className={`p-8 bg-gradient-to-br ${FEATURES[1].gradient}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCCB9A]/30 group-hover:bg-[#5E6B3F] transition-all duration-400">
                  <RefreshCw className="h-7 w-7 text-[#5E6B3F] group-hover:text-[#FBF9F5] transition-colors duration-400" />
                </div>
                <h3 className="mt-7 font-display text-xl font-bold text-[#2B2A26]">
                  {FEATURES[1].title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#6D685F]">
                  {FEATURES[1].body}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Second row */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {/* Small feature 2 */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden group"
            >
              <div className={`p-8 bg-gradient-to-br ${FEATURES[2].gradient}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A8B18A]/20 group-hover:bg-[#5E6B3F] transition-all duration-400">
                  <Quote className="h-7 w-7 text-[#5E6B3F] group-hover:text-[#FBF9F5] transition-colors duration-400" />
                </div>
                <h3 className="mt-7 font-display text-xl font-bold text-[#2B2A26]">
                  {FEATURES[2].title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#6D685F]">
                  {FEATURES[2].body}
                </p>
              </div>
            </motion.div>

            {/* Large feature 2 */}
            <motion.div
              variants={cardVariants}
              className="card-sand card-sand-hover overflow-hidden md:col-span-2 group"
            >
              <div className={`p-8 md:p-10 bg-gradient-to-br ${FEATURES[3].gradient}`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5E6B3F] shadow-warm-lg group-hover:scale-105 transition-transform duration-400">
                  <ShieldCheck className="h-8 w-8 text-[#FBF9F5]" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-bold text-[#2B2A26]">
                  {FEATURES[3].title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6D685F]">
                  {FEATURES[3].body}
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#5E6B3F] opacity-0 group-hover:opacity-100 transform translate-x-[-12px] group-hover:translate-x-0 transition-all duration-500">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="#integrations"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-btn border border-[#5E6B3F]/30 bg-[#FBF9F5] text-sm font-semibold text-[#5E6B3F] transition-all duration-300 hover:border-[#5E6B3F] hover:bg-[#E2E6D5] hover:shadow-warm"
          >
            See all integrations
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
