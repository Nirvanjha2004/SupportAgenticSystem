import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { ConnectorStatus } from '../../hooks/useConnectors'

const icons: Record<string, string> = {
  slack: '💬',
  google_docs: '📄',
  notion: '📝',
}

export default function ConnectorCard({ conn }: { conn: ConnectorStatus }) {
  return (
    <motion.div
      layout
      className="group relative rounded-card border border-line bg-surface p-5 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icons[conn.type] || '🔌'}</span>
          <div>
            <h3 className="font-display font-medium text-text-primary">{conn.name}</h3>
            <p className="text-xs font-mono text-text-muted">
              {conn.connected
                ? `${conn.docCount ?? 0} docs · ${conn.lastSynced || 'Never'}`
                : 'Not connected'}
            </p>
          </div>
        </div>
        <StatusBadge status={conn.status} />
      </div>

      {conn.status === 'syncing' && conn.progress !== undefined && (
        <div className="mt-4 h-1 w-full rounded-full bg-surface-raised overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${conn.progress * 100}%` }}
          />
        </div>
      )}

      {conn.connected && (
        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/sources/${conn.type}`}
            className="rounded-btn border border-line px-2 py-1 text-xs text-text-muted hover:text-text-primary hover:bg-surface-raised"
          >
            Details
          </Link>
          <button className="rounded-btn p-1 text-text-muted hover:text-text-primary hover:bg-surface-raised">
            <RefreshCw size={14} />
          </button>
          <button className="rounded-btn p-1 text-text-muted hover:text-signal-red hover:bg-surface-raised">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
