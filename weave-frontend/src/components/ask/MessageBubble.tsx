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
    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#5E6B3F]">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#FBF9F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function SourceModal({ source, onClose }: { source: Source; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#2B2A26]/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-sand overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A8B18A]/30 to-transparent" />

          <div className="flex items-start justify-between border-b border-[#DDD5C8] px-5 py-4">
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#E2E6D5] font-mono text-[10px] text-[#5E6B3F]">
                  {source.index}
                </span>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#8A857D]">Source</p>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-[#2B2A26]">{source.label}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-btn border border-[#DDD5C8] text-[#8A857D] transition-colors hover:border-[#5E6B3F]/40 hover:text-[#2B2A26]">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-btn border border-[#DDD5C8] text-[#8A857D] transition-colors hover:border-[#C5BBAA] hover:text-[#2B2A26]">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto px-5 py-4 [scrollbar-width:thin] [scrollbar-color:#DDD5C8_transparent]">
            <p className="font-mono text-[13px] leading-relaxed text-[#6D685F]">
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
        {role === 'assistant' && <AssistantAvatar />}

        <div className={`max-w-[78%] ${role === 'user' ? 'min-w-0' : 'min-w-0 flex-1'}`}>
          {role === 'assistant' && (
            <div className="space-y-3">
              <p className="text-sm leading-7 text-[#2B2A26]">{content}</p>
              {sources && sources.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.2 }}
                  className="flex flex-wrap gap-1.5 pt-0.5">
                  {sources.map((s) => (
                    <CitationChip key={s.index} index={s.index} label={s.label} onClick={() => setSelectedSource(s)} />
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {role === 'user' && (
            <div className="relative overflow-hidden rounded-[14px] rounded-br-[4px] bg-[#E2E6D5] px-4 py-3">
              <p className="text-sm leading-relaxed text-[#2B2A26]">{content}</p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedSource && <SourceModal source={selectedSource} onClose={() => setSelectedSource(null)} />}
      </AnimatePresence>
    </>
  )
}
