import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, Plus, Sparkles } from 'lucide-react'
import MessageBubble from '../../components/ask/MessageBubble'
import RetrievalStatus from '../../components/ask/RetrievalStatus'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  sources?: { index: number; label: string; content?: string }[]
}

const SUGGESTIONS = ['How do I reset the DB?', 'Refund policy', 'API keys setup']

export default function AskPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const question = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: question }])
    setLoading(true)

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'You can reset the staging database by running `make db-reset` from the root directory. This is documented in the onboarding guide [1] and was also discussed in #engineering last Tuesday [2].',
          sources: [
            { index: 1, label: 'Onboarding Guide · Notion', content: 'Run `make db-reset` to wipe and re-seed the staging database.' },
            { index: 2, label: '#engineering · Slack · Jul 14', content: 'Alice: Just run make db-reset, takes ~30s.' },
          ],
        },
      ])
      setLoading(false)
    }, 2500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-[#DDD5C8] bg-[#FBF9F5]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#DDD5C8] bg-[#FBF9F5] p-4 lg:flex lg:flex-col">
        <button className="w-full rounded-btn bg-[#5E6B3F] px-3 py-2.5 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#49552F] inline-flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          New question
        </button>

        <div className="mt-6 flex-1">
          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-[#8A857D] mb-3">
            Recent
          </p>
          <div className="space-y-0.5">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q) }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#6D685F] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26] truncate"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#DDD5C8] pt-4 mt-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A857D]">
            <Sparkles className="h-3 w-3" />
            <span>Ask about any source</span>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col bg-[#F5F1E8]">
        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E2E6D5]">
                  <MessageSquare className="h-7 w-7 text-[#5E6B3F]" />
                </div>
                <p className="font-display text-xl font-semibold text-[#2B2A26]">
                  What do you want to know?
                </p>
                <p className="mt-2 text-sm text-[#6D685F]">
                  Ask anything about your connected sources.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="rounded-full border border-[#DDD5C8] bg-[#FBF9F5] px-4 py-2 text-xs text-[#6D685F] transition-all hover:border-[#C5BBAA] hover:bg-[#FBF9F5] hover:text-[#2B2A26]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble role={m.role} content={m.content} sources={m.sources} />
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RetrievalStatus />
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-[#DDD5C8] bg-[#FBF9F5] p-4">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              className="max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-[#DDD5C8] bg-[#F5F1E8] px-4 py-3 text-sm text-[#2B2A26] placeholder:text-[#8A857D] transition-all focus:border-[#5E6B3F]/50 focus:outline-none focus:ring-2 focus:ring-[#5E6B3F]/10"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-[#5E6B3F] text-[#FBF9F5] transition-colors hover:bg-[#49552F] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] font-mono text-[#8A857D]">
            Answers are generated from your connected sources only
          </p>
        </div>
      </div>
    </div>
  )
}
