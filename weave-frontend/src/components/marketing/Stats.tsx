import { motion } from 'framer-motion'

const STATS = [
  { value: '500+', label: 'Teams connected' },
  { value: '2.4M', label: 'Documents indexed' },
  { value: '180ms', label: 'Avg. response latency' },
  { value: '98%', label: 'Answers with a valid citation' },
]

export default function Stats() {
  return (
    <section className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center md:text-left"
            >
              <div className="font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 font-mono text-xs text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
