import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const tabs = ['Workspace', 'Members', 'API keys', 'Billing']

export default function SettingsPage() {
  const [active, setActive] = useState('Workspace')
  const [copied, setCopied] = useState(false)

  return (
    <div className="max-w-3xl">
      <div className="flex gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 py-2 text-sm font-medium ${
              active === t ? 'border-b-2 border-accent text-accent' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === 'Workspace' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-muted">Workspace name</label>
              <input defaultValue="Acme Corp" className="mt-1 h-10 w-full rounded-btn border border-line bg-surface-raised px-3 text-sm text-text-primary focus:border-accent focus:outline-none" />
            </div>
            <div className="rounded-card border border-signal-red/50 bg-surface p-4">
              <h4 className="font-medium text-signal-red">Danger zone</h4>
              <p className="mt-1 text-xs text-text-muted">Deleting your workspace cannot be undone.</p>
              <button className="mt-3 rounded-btn border border-signal-red px-3 py-2 text-xs font-medium text-signal-red hover:bg-signal-red/10">
                Delete workspace
              </button>
            </div>
          </div>
        )}

        {active === 'API keys' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-card border border-line bg-surface p-3">
              <code className="font-mono text-xs text-text-muted">weave_••••••••••••••••••••••••••••••••</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('weave_sk_test_123')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="text-text-muted hover:text-accent"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button className="rounded-btn bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90">
              Generate new key
            </button>
          </div>
        )}

        {active === 'Billing' && (
          <div className="space-y-4">
            <div className="rounded-card border border-line bg-surface p-5">
              <h4 className="font-medium text-text-primary">Team plan</h4>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Chunks embedded</span>
                    <span>12,400 / 50,000</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-surface-raised">
                    <div className="h-full w-[24%] rounded-full bg-accent" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Queries this month</span>
                    <span>342 / 2,000</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-surface-raised">
                    <div className="h-full w-[17%] rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
