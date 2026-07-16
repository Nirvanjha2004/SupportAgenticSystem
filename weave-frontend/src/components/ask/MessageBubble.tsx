import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import CitationChip from './CitationChip'

interface Source {
  index: number
  label: string
  content?: string
  url?: string
}

interface Props {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

function AssistantAvatar() {
  return (
    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent to-[#5B8DF0] shadow-[0_0_12px_-2px_rgba(108,99,255,0.6)]">
      <span className="h-1.5 w-1.5 rounded-[2px] bg-white" />
    </div>
  )
}

function SourceModal({
  source,
  onClose,
}: {
  source: Source
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* glow ring */}
        <div className="absolute -inset-px rounded-[13px] bg-gradient-to-b from-accent/20 via-line/40 to-line/20 opacity-70" />

        <div className="relative overflow-hidden rounded-card border border-line bg-surface shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)]">
          {/* top shimmer */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />

          {/* header */}
          <div className="flex items-start justify-between border-b border-line px-5 py-4">
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/15 font-mono text-[10px] text-accent">
                  {source.index}
                </span>
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Source
                </p>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-text-primary">
                {source.label}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-btn border border-line text-text-muted transition-colors hover:border-accent/40 hover:text-text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-btn border border-line text-text-muted transition-colors hover:border-line/80 hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* content */}
          <div className="max-h-64 overflow-y-auto px-5 py-4 [scrollbar-width:thin] [scrollbar-color:#26314A_transparent]">
            <p className="font-mono text-[13px] leading-relaxed text-text-muted">
              {source.content ?? 'Full source content will appear here once connected to the backend.'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MessageBubble({ role, content, sources }: Props) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {/* assistant avatar — left side */}
        {role === 'assistant' && <AssistantAvatar />}

        <div className={`max-w-[78%] ${role === 'user' ? 'min-w-0' : 'min-w-0 flex-1'}`}>
          {/* ── ASSISTANT ── */}
          {role === 'assistant' && (
            <div className="space-y-3">
              <p className="text-sm leading-7 text-text-primary">{content}</p>

              {sources && sources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.2 }}
                  className="flex flex-wrap gap-1.5 pt-0.5"
                >
                  {sources.map((s) => (
                    <CitationChip
                      key={s.index}
                      index={s.index}
                      label={s.label}
                      onClick={() => setSelectedSource(s)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* ── USER ── */}
          {role === 'user' && (
            <div className="relative overflow-hidden rounded-[14px] rounded-br-[4px] bg-accent/15 px-4 py-3 ring-1 ring-accent/25">
              <p className="text-sm leading-relaxed text-text-primary">{content}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* source detail modal */}
      <AnimatePresence>
        {selectedSource && (
          <SourceModal
            source={selectedSource}
            onClose={() => setSelectedSource(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}