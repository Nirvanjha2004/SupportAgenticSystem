import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Connect',
    body: 'One-click OAuth per source. Slack, Notion, and Google Docs — no exports.',
  },
  {
    n: '02',
    title: 'Ingest',
    body: 'A full backfill runs once, then live sync keeps every new message and edit current.',
  },
  {
    n: '03',
    title: 'Ask',
    body: 'Query in plain English from the Ask page. Every answer cites where it came from.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">How it works</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
            From connected to answered in minutes
          </h2>
        </motion.div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connector line, desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px md:block">
            <svg className="h-px w-full overflow-visible">
              <motion.line
                x1="16%"
                x2="84%"
                y1="0"
                y2="0"
                stroke="#26314A"
                strokeWidth="1"
              />
              <motion.line
                x1="16%"
                x2="84%"
                y1="0"
                y2="0"
                stroke="#6C63FF"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -24 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                opacity={0.6}
              />
            </svg>
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink font-mono text-sm text-accent md:mx-0">
                {step.n}
              </div>
              <h3 className="mt-5 text-center font-display text-xl font-semibold text-text-primary md:text-left">
                {step.title}
              </h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-text-muted md:text-left">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
