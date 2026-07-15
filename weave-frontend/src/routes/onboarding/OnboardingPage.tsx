import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const connectors = [
  { type: 'slack', name: 'Slack', icon: '💬' },
  { type: 'google_docs', name: 'Google Docs', icon: '📄' },
  { type: 'notion', name: 'Notion', icon: '📝' },
]

export default function OnboardingPage() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[520px] rounded-card border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Name your workspace</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Corp"
          className="mt-4 h-10 w-full rounded-btn border border-line bg-surface-raised px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />

        <h2 className="mt-8 font-display text-lg font-medium text-text-primary">Connect your first source</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {connectors.map((c) => (
            <motion.button
              key={c.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface-raised p-4 hover:border-accent/50"
              onClick={() => window.location.href = `http://localhost:8000/connectors/${c.type}/install`}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-xs font-medium text-text-primary">{c.name}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 text-xs text-text-muted hover:text-text-primary"
        >
          I'll do this later
        </button>
      </div>
    </div>
  )
}
