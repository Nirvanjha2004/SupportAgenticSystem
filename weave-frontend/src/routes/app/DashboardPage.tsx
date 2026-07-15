import { motion } from 'framer-motion'
import { useConnectors } from '../../hooks/useConnectors'

export default function DashboardPage() {
  const { data: connectors } = useConnectors()

  const connected = connectors?.filter((c) => c.connected).length ?? 0
  const totalDocs = connectors?.reduce((sum, c) => sum + (c.docCount ?? 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Sources connected', value: connected },
          { label: 'Documents ingested', value: totalDocs.toLocaleString() },
          { label: 'Questions answered this week', value: '12' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border border-line bg-surface p-5"
          >
            <div className="font-display text-3xl font-semibold text-text-primary">{stat.value}</div>
            <div className="mt-1 font-mono text-xs text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-card border border-line bg-surface p-5">
        <h3 className="font-display text-sm font-medium text-text-primary">Recent activity</h3>
        <div className="mt-4 space-y-3">
          {connectors?.map((c) => (
            <div key={c.type} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    c.status === 'syncing' ? 'bg-signal-amber' : c.status === 'error' ? 'bg-signal-red' : 'bg-signal-green'
                  }`}
                />
                <span className="text-text-primary">{c.name}</span>
                <span className="text-text-muted">
                  {c.status === 'syncing' ? 'Syncing…' : `${c.docCount} docs indexed`}
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted">{c.lastSynced || 'Now'}</span>
            </div>
          ))}
          {(!connectors || connectors.length === 0) && (
            <div className="py-8 text-center text-sm text-text-muted">
              Nothing connected yet.{' '}
              <a href="/sources" className="text-accent hover:underline">Connect a source</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
