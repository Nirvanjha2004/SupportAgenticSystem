import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowRight, Shield, Key, CreditCard, Users } from 'lucide-react'

const tabs = [
  { id: 'Workspace', label: 'Workspace', icon: Shield },
  { id: 'Members', label: 'Members', icon: Users },
  { id: 'API keys', label: 'API Keys', icon: Key },
  { id: 'Billing', label: 'Billing', icon: CreditCard },
]

export default function SettingsPage() {
  const [active, setActive] = useState('Workspace')
  const [copied, setCopied] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl space-y-8"
    >
      {/* Editorial header */}
      <div>
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
          Configuration
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26] md:text-3xl">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-[#6D685F]">
          Manage your workspace, API keys, and billing.
        </p>
      </div>

      {/* Tabs */}
      <div className="card-sand overflow-hidden">
        <div className="flex border-b border-[#DDD5C8] overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                active === t.id
                  ? 'border-b-2 border-[#5E6B3F] text-[#5E6B3F] bg-[#F5F1E8]'
                  : 'text-[#6D685F] hover:bg-[#F5F1E8] hover:text-[#2B2A26]'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Workspace */}
          {active === 'Workspace' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <label className="text-xs font-medium text-[#6D685F]">Workspace name</label>
                <input
                  defaultValue="Acme Corp"
                  className="mt-1.5 h-11 w-full rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-4 text-sm text-[#2B2A26] transition-all focus:border-[#5E6B3F]/50 focus:outline-none focus:ring-2 focus:ring-[#5E6B3F]/10"
                />
              </div>
              <div className="border-t border-[#DDD5C8]/50 pt-6">
                <div className="card-sand border border-[#A84F3A]/30 p-5">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#A84F3A]">
                    <Shield className="h-4 w-4" />
                    Danger zone
                  </h4>
                  <p className="mt-2 text-xs text-[#6D685F]">Deleting your workspace cannot be undone. All data will be permanently removed.</p>
                  <button className="mt-4 rounded-btn border border-[#A84F3A]/50 bg-[#FBF9F5] px-4 py-2 text-xs font-medium text-[#A84F3A] transition-colors hover:bg-[#A84F3A]/5">
                    Delete workspace
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* API Keys */}
          {active === 'API keys' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between card-sand p-4">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-[#5E6B3F]" />
                  <code className="font-mono text-xs text-[#6D685F]">weave_••••••••••••••••••••••••••••••••</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('weave_sk_test_123')
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="flex items-center gap-1 text-[#8A857D] transition-colors hover:text-[#5E6B3F]"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span className="text-[10px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <button className="group inline-flex items-center gap-2 rounded-btn bg-[#5E6B3F] px-5 py-2.5 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#49552F]">
                Generate new key
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          )}

          {/* Billing */}
          {active === 'Billing' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="card-sand p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2E6D5]">
                    <CreditCard className="h-5 w-5 text-[#5E6B3F]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2B2A26]">Team plan</h4>
                    <p className="text-xs text-[#8A857D]">Current billing cycle</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs text-[#6D685F]">
                      <span>Chunks embedded</span>
                      <span className="font-mono">12,400 / 50,000</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-[#DDD5C8]">
                      <div className="h-full w-[24%] rounded-full bg-gradient-to-r from-[#5E6B3F] to-[#A8B18A]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[#6D685F]">
                      <span>Queries this month</span>
                      <span className="font-mono">342 / 2,000</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-[#DDD5C8]">
                      <div className="h-full w-[17%] rounded-full bg-gradient-to-r from-[#5E6B3F] to-[#A8B18A]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Members */}
          {active === 'Members' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-sand flex flex-col items-center py-12 text-center">
              <Users className="h-10 w-10 text-[#8A857D]/40 mb-3" />
              <p className="text-sm text-[#6D685F]">Member management coming soon.</p>
              <p className="mt-1 text-xs text-[#8A857D]">You'll be able to invite and manage team members here.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
