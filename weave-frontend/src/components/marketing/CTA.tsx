import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="border-t border-line px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-card border border-line px-8 py-16 text-center md:px-16"
        style={{
          background:
            'radial-gradient(120% 140% at 50% -20%, rgba(108,99,255,0.35), rgba(19,26,43,0.9) 60%)',
        }}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#5B8DF0]/20 blur-[100px]" />

        <div className="relative">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Stop searching. Start asking.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-muted">
            Connect your first source in under two minutes. No credit card required.
          </p>
          <Link
            to="/onboarding"
            className="mt-8 inline-block rounded-btn bg-accent px-7 py-3 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(108,99,255,0.7)] transition-transform hover:scale-[1.03]"
          >
            Connect your first source
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
