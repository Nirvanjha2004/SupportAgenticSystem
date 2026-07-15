import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, Code2, BookOpen, Ticket } from 'lucide-react'

const INTEGRATIONS = [
  { name: 'Slack', icon: MessageSquare, status: 'connected' as const },
  { name: 'Notion', icon: FileText, status: 'connected' as const },
  { name: 'Google Docs', icon: FileSpreadsheet, status: 'connected' as const },
  { name: 'GitHub', icon: Code2, status: 'soon' as const },
  { name: 'Confluence', icon: BookOpen, status: 'soon' as const },
  { name: 'Zendesk', icon: Ticket, status: 'soon' as const },
]

function StatusBadge({ status }: { status: 'connected' | 'soon' }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-2.5 py-1 font-mono text-[10px] text-signal-green">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-2.5 py-1 font-mono text-[10px] text-text-muted">
      Coming soon
    </span>
  )
}

export default function Integrations() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Integrations</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
              Connect where your knowledge already lives
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {INTEGRATIONS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`flex items-center justify-between rounded-card border p-5 transition-colors ${
                item.status === 'connected'
                  ? 'border-line bg-surface hover:border-accent/50'
                  : 'border-line/60 bg-surface/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-raised">
                  <item.icon
                    className={`h-4 w-4 ${item.status === 'connected' ? 'text-text-primary' : 'text-text-muted'}`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    item.status === 'connected' ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <StatusBadge status={item.status} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
