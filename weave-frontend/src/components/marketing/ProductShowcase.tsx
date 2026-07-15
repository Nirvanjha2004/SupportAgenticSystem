import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet } from 'lucide-react'

function BrowserChrome() {
  return (
    <div className="relative rounded-xl border border-line bg-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F0546A]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F5A623]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3DD68C]/70" />
        <div className="ml-4 flex-1 rounded-md bg-ink px-3 py-1 font-mono text-[11px] text-text-muted">
          app.weave.so/ask
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr] gap-0">
        {/* mock sidebar */}
        <div className="hidden border-r border-line p-4 sm:block">
          <div className="mb-4 h-3 w-16 rounded bg-surface-raised" />
          {[MessageSquare, FileText, FileSpreadsheet].map((Icon, i) => (
            <div
              key={i}
              className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-text-muted"
            >
              <Icon className="h-3.5 w-3.5" />
              <div className="h-2 w-16 rounded bg-surface-raised" />
            </div>
          ))}
        </div>

        {/* mock chat thread */}
        <div className="space-y-4 p-6">
          <div className="ml-auto max-w-[70%] rounded-lg bg-accent/15 px-4 py-2.5 text-sm text-text-primary">
            How do we handle enterprise SSO requests?
          </div>

          <div className="max-w-[85%] space-y-3">
            <p className="text-sm leading-relaxed text-text-primary">
              Enterprise SSO requests route through the onboarding team. SAML setup takes
              roughly 2 business days once the customer shares their IdP metadata.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-line bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-text-muted">
                #enterprise-onboarding · Slack
              </span>
              <span className="rounded-full border border-line bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-text-muted">
                SSO Runbook · Notion
              </span>
            </div>
          </div>

          <div className="h-9 rounded-lg border border-line bg-surface-raised" />
        </div>
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">See it in action</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
            One thread. Every source. A cited answer.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14"
        >
          <BrowserChrome />
        </motion.div>
      </div>
    </section>
  )
}
