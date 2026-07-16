import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, FileSpreadsheet, ArrowRight, Sparkles, Zap } from 'lucide-react';

const TRUST_ITEMS = [
  { label: 'Slack', icon: MessageSquare },
  { label: 'Notion', icon: FileText },
  { label: 'Google Docs', icon: FileSpreadsheet },
];

function BackgroundTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Warm radial glow */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#DCCB9A]/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-[#A8B18A]/10 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#C4A882]/10 blur-[120px]"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #5E6B3F 1px, transparent 1px), linear-gradient(to bottom, #5E6B3F 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 70%)',
        }}
      />

      {/* Paper grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] mix-blend-multiply">
        <filter id="heroGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroGrain)" />
      </svg>
    </div>
  );
}

function HeroVisual() {
  const sources = [
    { label: 'Slack', icon: MessageSquare, color: '#4A154B', bg: 'rgba(74, 21, 75, 0.06)' },
    { label: 'Notion', icon: FileText, color: '#2B2A26', bg: 'rgba(43, 42, 38, 0.05)' },
    { label: 'Google Docs', icon: FileSpreadsheet, color: '#4285F4', bg: 'rgba(66, 133, 244, 0.06)' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Main card - warm paper */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="card-sand overflow-hidden shadow-warm-lg card-premium"
      >
        <div className="p-6 md:p-8">
          {/* Source connection lines */}
          <div className="relative flex items-start justify-between gap-6 mt-0">
            <div className="flex flex-col gap-3">
              {sources.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2.5 rounded-xl border border-[#DDD5C8]/60 bg-[#FBF9F5]/80 px-3.5 py-2.5 hover:border-[#A8B18A]/50 transition-all duration-300 hover:shadow-warm"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: s.bg }}
                  >
                    <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                  </span>
                  <span className="text-sm font-medium text-[#6D685F]">{s.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Organic connecting SVG */}
            <svg
              className="absolute left-[120px] top-2 h-[132px] w-24 overflow-visible"
              viewBox="0 0 96 132"
              fill="none"
            >
              {[20, 66, 112].map((y, i) => (
                <motion.path
                  key={y}
                  d={`M0 ${y} C 40 ${y}, 52 66, 96 66`}
                  stroke="#A8B18A"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  initial={{ strokeDashoffset: 40 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.2,
                  }}
                  opacity={0.6}
                />
              ))}
            </svg>

            {/* Center node - olive circle */}
            <motion.div
              animate={{
                y: [0, -4, 0],
                boxShadow: [
                  '0 0 0 0 rgba(94, 107, 63, 0.2)',
                  '0 0 0 12px rgba(94, 107, 63, 0)',
                  '0 0 0 0 rgba(94, 107, 63, 0)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="mt-8 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5E6B3F] shadow-soft"
            >
              <Zap className="h-5 w-5 text-[#FBF9F5] fill-current" />
            </motion.div>
          </div>

          {/* Answer card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-0 rounded-xl border border-[#DDD5C8]/50 bg-gradient-hero p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E2E6D5]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#5E6B3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
                Question
              </span>
            </div>
            <p className="text-sm font-semibold text-[#2B2A26]">
              "What's our refund policy for annual plans?"
            </p>
            <div className="my-3 border-t border-[#DDD5C8]/40" />
            <p className="text-sm leading-relaxed text-[#6D685F]">
              Annual plans are refundable within 30 days of purchase, prorated after that. Contact support to initiate.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD5C8]/50 bg-[#FBF9F5] px-2.5 py-1 text-[10px] font-medium text-[#6D685F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
                #billing-faq · Notion
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD5C8]/50 bg-[#FBF9F5] px-2.5 py-1 text-[10px] font-medium text-[#6D685F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5E6B3F]" />
                #support-eng · Slack
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden paper-texture">
      <BackgroundTexture />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex min-h-screen flex-col justify-center pb-24 pt-28 md:pt-36 lg:pb-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
            {/* Left column — editorial headline */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Editorial headline */}
              <motion.h1
                variants={itemVariants}
                className="mt-0 max-w-2xl font-display text-hero font-bold leading-[1.02] tracking-tight text-[#2B2A26] md:text-hero-md"
              >
                Your company's{' '}
                <span className="font-serif italic font-normal text-[#5E6B3F]">
                  knowledge
                </span>
                ,<br />
                <span className="relative inline-block">
                  one conversation away.
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[#5E6B3F] via-[#DCCB9A] to-[#A8B18A]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-lg text-base leading-relaxed text-[#6D685F] md:text-lg"
              >
                Connect Slack, Notion, and Google Docs. Weave keeps everything in sync and
                answers questions in plain English — with a source for every answer.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/onboarding"
                  className="group inline-flex items-center gap-2 btn-primary px-6 py-3 text-sm font-medium"
                >
                  Connect your first source
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center gap-2 btn-secondary px-6 py-3 text-sm font-medium"
                >
                  See how it works
                  <ArrowRight className="h-3.5 w-3.5 text-[#8A857D] transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </motion.div>

              {/* Trust bar */}
              <motion.div
                variants={itemVariants}
                className="mt-16"
              >
                <p className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
                  Works with the tools you already use
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  {TRUST_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2 text-[#6D685F]/70 transition-all duration-300 hover:text-[#2B2A26] hover:scale-105"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right column - Visual */}
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
