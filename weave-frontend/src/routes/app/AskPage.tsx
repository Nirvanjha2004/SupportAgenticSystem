import { useState, useRef, useEffect } from 'react'
import MessageBubble from '../../components/ask/MessageBubble'
import RetrievalStatus from '../../components/ask/RetrievalStatus'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  sources?: { index: number; label: string; content?: string }[]
}

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

  return (
    <div className="flex h-[calc(100vh-7rem)]">
      <aside className="w-64 shrink-0 border-r border-line bg-surface p-3 hidden lg:block">
        <button className="w-full rounded-btn bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90">
          + New question
        </button>
        <div className="mt-4 space-y-1">
          {['How do I reset the DB?', 'Refund policy', 'API keys setup'].map((q) => (
            <div key={q} className="cursor-pointer rounded-btn px-2 py-1.5 text-xs text-text-muted hover:bg-surface-raised hover:text-text-primary truncate">
              {q}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-text-muted">
              <p className="font-display text-lg">What do you want to know?</p>
              <p className="mt-2 text-sm">Ask anything about your connected sources.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} sources={m.sources} />
          ))}
          {loading && <RetrievalStatus />}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-line bg-surface p-4">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Ask a question…"
              className="max-h-32 min-h-[40px] w-full resize-none rounded-btn border border-line bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="h-10 shrink-0 rounded-btn bg-accent px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-[10px] font-mono text-text-muted">
            Answers are generated from your connected sources only
          </p>
        </div>
      </div>
    </div>
  )
}
