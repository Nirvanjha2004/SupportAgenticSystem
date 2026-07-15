import { motion } from 'framer-motion'
import { Search, GitBranch, Link2, RefreshCw, Layers } from 'lucide-react'

const CAPABILITIES = [
  { icon: Search, title: 'Semantic search', body: 'Finds meaning, not just keywords, across every connected source.' },
  { icon: GitBranch, title: 'Retrieval-augmented generation', body: 'Answers are grounded in your actual documents, not memorized guesses.' },
  { icon: Link2, title: 'Source citations', body: 'Every answer links to the exact message, page, or paragraph it drew from.' },
  { icon: RefreshCw, title: 'Live sync', body: 'Webhooks push new content into your index within seconds of it being created.' },
  { icon: Layers, title: 'Multi-source retrieval', body: 'One query searches Slack, Notion, and Docs together, ranked by relevance.' },
]

export default function AICapabilities() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Under the hood</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
            Serious retrieval, not a search bar with a chat skin
          </h2>
        </motion.div>

        <div className="mt-12 flex flex-wrap gap-4">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex max-w-sm items-start gap-3 rounded-card border border-line bg-surface px-5 py-4"
            >
              <cap.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{cap.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{cap.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
