import { useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

const STATS = [
  { value: 500, suffix: '+', label: 'Teams connected' },
  { value: 2.4, suffix: 'M', label: 'Documents indexed', decimal: true },
  { value: 180, suffix: 'ms', label: 'Avg. response latency' },
  { value: 98, suffix: '%', label: 'Answers with a valid citation' },
]

function AnimatedCounter({
  value,
  suffix,
  decimal,
}: {
  value: number
  suffix: string
  decimal?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.5,
  })
  const displayValue = useTransform(springValue, (latest) => {
    if (decimal) {
      return latest.toFixed(1)
    }
    return Math.round(latest).toLocaleString()
  })

  if (isInView && motionValue.get() === 0) {
    motionValue.set(value)
  }

  return (
    <span ref={ref}>
      {isInView ? (
        <motion.span>
          <motion.span className="font-display">{displayValue}</motion.span>
          <span className="font-display text-[#5E6B3F]">{suffix}</span>
        </motion.span>
      ) : (
        <span>
          <span className="font-display">0</span>
          <span className="font-display text-[#5E6B3F]">{suffix}</span>
        </span>
      )}
    </span>
  )
}

const statVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Stats() {
  return (
    <section className="relative bg-[#EEE7DA]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={statVariants}
              className="text-center"
            >
              <div className="font-display text-4xl font-semibold tracking-tight text-[#2B2A26] md:text-5xl lg:text-6xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimal={stat.decimal}
                />
              </div>
              <div className="mt-3 text-sm text-[#8A857D]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
