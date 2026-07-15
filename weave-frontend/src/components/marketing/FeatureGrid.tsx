import { motion } from 'framer-motion'
import { Zap, RefreshCw, Quote, ShieldCheck } from 'lucide-react'

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

export default function FeatureGrid() {
  return (
    <section id="features" className="relative border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Built for real teams</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
            Everything you need, nothing you have to babysit
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative rounded-card p-[1px] transition-transform duration-300 hover:-translate-y-1"
              style={{
                background:
                  'linear-gradient(135deg, rgba(108,99,255,0.35), rgba(38,49,74,0.4))',
              }}
            >
              <div className="relative h-full rounded-[calc(theme(borderRadius.card)-1px)] bg-ink p-6">
                <div
                  className="absolute inset-0 rounded-[calc(theme(borderRadius.card)-1px)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(320px circle at 20% 0%, rgba(108,99,255,0.12), transparent 70%)',
                  }}
                />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-raised">
                    <feature.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{feature.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
