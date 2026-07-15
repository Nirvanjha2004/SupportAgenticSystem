import { motion } from 'framer-motion'

// Placeholder companies for demo purposes — replace with real logos once you have customers.
const COMPANIES = ['Northwind', 'Lumen Labs', 'Fieldstone', 'Arclight', 'Greywolf', 'Basecamp Rd']

export default function SocialProof() {
  return (
    <section className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-mono text-xs uppercase tracking-wider text-text-muted"
        >
          Trusted by support and ops teams at
        </motion.p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {COMPANIES.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="font-display text-lg font-medium text-text-muted/50 transition-colors hover:text-text-muted"
            >
              {name}
            </motion.span>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <p className="font-display text-xl font-medium leading-relaxed text-text-primary md:text-2xl">
            "We stopped losing answers in Slack threads. Now the whole team just asks Weave
            instead of pinging whoever remembers."
          </p>
          <footer className="mt-5 font-mono text-sm text-text-muted">
            Priya Shah · Head of Support, Lumen Labs
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
