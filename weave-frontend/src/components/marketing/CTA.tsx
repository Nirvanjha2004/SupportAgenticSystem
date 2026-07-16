import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#F5F1E8] py-24 md:py-32">
      <div className="divider-organic" />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#DCCB9A]/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#A8B18A]/15 blur-[120px]"
      />

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

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-[#2B2A26] md:text-5xl lg:text-6xl mt-0">
            Stop searching.{' '}
            <span className="font-serif italic font-normal text-[#5E6B3F]">Start asking.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6D685F] md:text-lg">
            Connect your first source in under two minutes. No credit card required.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/onboarding"
              className="group inline-flex items-center gap-2 btn-primary px-8 py-4 text-sm font-semibold shadow-warm-lg hover:shadow-warm-xl"
            >
              Connect your first source
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 btn-secondary px-8 py-4 text-sm font-semibold"
            >
              Log in
              <ArrowRight className="h-3.5 w-3.5 text-[#8A857D] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-6 text-sm text-[#8A857D]"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#567D46]" />
              <span>No credit card required</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-[#DDD5C8]" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#567D46]" />
              <span>14-day free trial</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-[#DDD5C8]" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#567D46]" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
