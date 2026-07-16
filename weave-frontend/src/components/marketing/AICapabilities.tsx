import { motion } from 'framer-motion'
import { Search, GitBranch, Link2, RefreshCw, Layers, Sparkles } from 'lucide-react'

const CAPABILITIES = [
  {
    icon: Search,
    title: 'Semantic search',
    body: 'Finds meaning, not just keywords, across every connected source.',
  },
  {
    icon: GitBranch,
    title: 'Retrieval-augmented generation',
    body: 'Answers are grounded in your actual documents, not memorized guesses.',
  },
  {
    icon: Link2,
    title: 'Source citations',
    body: 'Every answer links to the exact message, page, or paragraph it drew from.',
  },
  {
    icon: RefreshCw,
    title: 'Live sync',
    body: 'Webhooks push new content into your index within seconds of it being created.',
  },
  {
    icon: Layers,
    title: 'Multi-source retrieval',
    body: 'One query searches Slack, Notion, and Docs together, ranked by relevance.',
  },
  {
    icon: Sparkles,
    title: 'Smart reranking',
    body: 'Results are intelligently scored so the most useful answer surfaces first.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function AICapabilities() {
  return (
    <section className="relative bg-[#EEE7DA]">
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
            Under the hood
          </span>
          <h2 className="mt-5 font-display text-heading font-semibold tracking-tight text-[#2B2A26] md:text-heading-md">
            Serious retrieval,{' '}
            <span className="text-[#6D685F]">not a search bar</span>
          </h2>
        </motion.div>

        {/* Capabilities grid - warm cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              variants={cardVariants}
              className="card-sand card-sand-hover p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DDD5C8]/60 bg-[#F5F1E8] transition-colors duration-300 group-hover:bg-[#E2E6D5]">
                  <cap.icon className="h-5 w-5 text-[#5E6B3F]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#2B2A26]">{cap.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#6D685F]">{cap.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
