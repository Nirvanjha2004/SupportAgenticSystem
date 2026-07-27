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
  const lastSynced = conn.lastSynced
  const docCount = conn.docCount

  return (
    <motion.div
      layout
      className="card-sand card-sand-hover p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icons[conn.type] || '🔌'}</span>
          <div>
            <h3 className="font-display font-medium text-[#2B2A26]">{conn.name}</h3>
            <p className="font-mono text-xs text-[#8A857D]">
              {conn.connected
                ? `${docCount ?? 0} docs · ${lastSynced || 'Never'}`
                : 'Not connected'}
            </p>
          </div>
        </div>
        <StatusBadge status={conn.status} />
      </div>

      {conn.status === 'syncing' && conn.progress !== undefined && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#DDD5C8]">
          <motion.div
            className="h-full rounded-full bg-[#5E6B3F]"
            animate={{ width: `${conn.progress * 100}%` }}
          />
        </div>
      )}

      {conn.connected && (
        <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            to={`/sources/${conn.type}`}
            className="rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-2 py-1 text-xs text-[#6D685F] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
          >
            Details
          </Link>
          <button className="rounded-btn p-1 text-[#8A857D] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26]">
            <RefreshCw size={14} />
          </button>
          <button className="rounded-btn p-1 text-[#8A857D] transition-colors hover:bg-[#A84F3A]/10 hover:text-[#A84F3A]">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
