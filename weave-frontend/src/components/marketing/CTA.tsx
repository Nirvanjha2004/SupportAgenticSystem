import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#F5F1E8]">
      <div className="divider-organic" />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#DCCB9A]/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#A8B18A]/10 blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #5E6B3F 1px, transparent 1px), linear-gradient(to bottom, #5E6B3F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DDD5C8] bg-[#FBF9F5] shadow-soft"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="4" width="20" height="20" rx="5" stroke="#5E6B3F" strokeWidth="2" />
              <path
                d="M10 14l3 3 5-5"
                stroke="#5E6B3F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h2 className="font-display text-3xl font-semibold tracking-tight text-[#2B2A26] md:text-4xl lg:text-5xl">
            Stop searching.{' '}
            <span className="font-serif italic font-normal text-[#5E6B3F]">Start asking.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#6D685F] md:text-lg">
            Connect your first source in under two minutes. No credit card required.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/onboarding"
              className="group inline-flex items-center gap-2 rounded-btn bg-[#5E6B3F] px-7 py-3.5 text-sm font-medium text-[#FBF9F5] shadow-soft transition-all duration-300 hover:bg-[#49552F] hover:shadow-card-hover active:scale-[0.97]"
            >
              Connect your first source
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-btn border border-[#DDD5C8] px-7 py-3.5 text-sm font-medium text-[#2B2A26] transition-all duration-300 hover:border-[#C5BBAA] hover:bg-[#FBF9F5]/50 active:scale-[0.98]"
            >
              Log in
              <ArrowRight className="h-3.5 w-3.5 text-[#8A857D] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-8 text-xs text-[#8A857D]/70"
          >
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
