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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A8B18A]/30 bg-[#E2E6D5] px-2.5 py-1 text-[10px] font-medium text-[#5E6B3F]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDD5C8]/50 bg-[#F5F1E8] px-2.5 py-1 text-[10px] font-medium text-[#8A857D]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#C5BBAA]" />
      Coming soon
    </span>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Integrations() {
  return (
    <section id="integrations" className="relative bg-[#F5F1E8]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-2xl"
        >
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            Integrations
          </span>
          <h2 className="mt-5 font-display text-heading font-semibold tracking-tight text-[#2B2A26] md:text-heading-md">
            Connect where your knowledge{' '}
            <span className="relative inline-block">
              <span className="text-[#6D685F]">already lives</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#DCCB9A]/60" />
            </span>
          </h2>
        </motion.div>

        {/* Floating tile grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={cardVariants}
              className={`card-sand card-sand-hover p-5 ${
                item.status === 'soon'
                  ? 'opacity-60 hover:opacity-80'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                      item.status === 'connected'
                        ? 'border-[#DDD5C8]/60 bg-[#F5F1E8]'
                        : 'border-[#DDD5C8]/30 bg-[#F5F1E8]/50'
                    }`}
                  >
                    <item.icon
                      className={`h-[18px] w-[18px] ${
                        item.status === 'connected' ? 'text-[#5E6B3F]' : 'text-[#8A857D]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.status === 'connected' ? 'text-[#2B2A26]' : 'text-[#8A857D]'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
