import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet } from 'lucide-react'

function BrowserChrome() {
  return (
    <div className="relative">
      {/* Subtle shadow behind */}
      <div className="absolute -inset-4 rounded-[24px] bg-[#DCCB9A]/10 blur-[40px]" />

      <div className="card-sand relative overflow-hidden shadow-warm-lg">
        {/* Mock browser header */}
        <div className="flex items-center gap-2 border-b border-[#DDD5C8]/60 bg-[#FBF9F5] px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDD5C8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDD5C8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDD5C8]" />
          <div className="ml-4 flex flex-1 items-center gap-2 rounded-lg bg-[#F5F1E8] px-3 py-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <path
                d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"
                stroke="#8A857D"
                strokeWidth="0.5"
              />
            </svg>
            <span className="flex-1 text-[11px] leading-none text-[#8A857D]">app.weave.so</span>
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <div className="hidden border-r border-[#DDD5C8]/40 bg-[#F5F1E8]/40 p-4 md:block">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#5E6B3F]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="0.5" width="9" height="9" rx="2" stroke="#FBF9F5" strokeWidth="1" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-[#2B2A26]">Sources</span>
            </div>

            {[
              { icon: MessageSquare, label: 'Slack', active: true },
              { icon: FileText, label: 'Notion', active: true },
              { icon: FileSpreadsheet, label: 'Google Docs', active: true },
            ].map((item) => (
              <div
                key={item.label}
                className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                  item.active
                    ? 'bg-[#E2E6D5] text-[#2B2A26]'
                    : 'text-[#8A857D] hover:bg-[#EEE7DA]/50'
                }`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
                )}
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div className="space-y-5 p-6">
            {/* User question */}
            <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-[#E2E6D5] px-4 py-3">
              <p className="text-sm text-[#2B2A26]">
                How do we handle enterprise SSO requests?
              </p>
            </div>

            {/* AI response */}
            <div className="max-w-[85%] space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5E6B3F]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#FBF9F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-[#6D685F]">Weave</span>
              </div>

              <div className="rounded-2xl rounded-tl-md border border-[#DDD5C8]/40 bg-[#FBF9F5] p-4">
                <p className="text-sm leading-relaxed text-[#2B2A26]">
                  Enterprise SSO requests route through the onboarding team. SAML setup takes
                  roughly 2 business days once the customer shares their IdP metadata.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD5C8]/40 bg-[#F5F1E8] px-2 py-1 text-[10px] font-medium text-[#6D685F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
                    #enterprise-onboarding · Slack
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD5C8]/40 bg-[#F5F1E8] px-2 py-1 text-[10px] font-medium text-[#6D685F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
                    SSO Runbook · Notion
                  </span>
                </div>
              </div>
            </div>

            {/* Input mock */}
            <div className="flex items-center gap-2 rounded-xl border border-[#DDD5C8]/50 bg-[#FBF9F5] px-4 py-3">
              <span className="text-sm text-[#8A857D]">Ask a follow-up...</span>
              <div className="ml-auto flex items-center gap-2">
                <kbd className="hidden rounded-md border border-[#DDD5C8]/50 bg-[#F5F1E8] px-1.5 py-0.5 text-[10px] text-[#8A857D] md:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  return (
    <section className="relative bg-[#EEE7DA]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            See it in action
          </span>
          <h2 className="mt-5 font-display text-heading font-semibold tracking-tight text-[#2B2A26] md:text-heading-md">
            One thread.{' '}
            <span className="font-serif italic font-normal text-[#5E6B3F]">Every source.</span>{' '}
            A cited answer.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6D685F]">
            Ask in plain English and get answers grounded in your actual documents — always with a source you can verify.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-14"
        >
          <BrowserChrome />
        </motion.div>
      </div>
    </section>
  )
}
