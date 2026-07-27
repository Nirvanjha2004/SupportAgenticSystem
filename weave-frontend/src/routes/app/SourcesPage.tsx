import { motion } from 'framer-motion'
import { useConnectors } from '../../hooks/useConnectors'
import ConnectorCard from '../../components/sources/ConnectorCard'
import { Plug, CheckCircle, Clock } from 'lucide-react'

export default function SourcesPage() {
  const { data: connectors } = useConnectors()

  const connected = connectors?.filter((c) => c.connected).length ?? 0
  const syncing = connectors?.filter((c) => c.status === 'syncing').length ?? 0
  const total = connectors?.length ?? 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl space-y-6"
    >
      {/* Editorial header */}
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } }}>
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
          Integrations
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26] md:text-3xl">
          Sources
        </h1>
        <p className="mt-1.5 text-sm text-[#6D685F]">
          Connect and manage your knowledge sources.
        </p>
      </motion.div>

      {/* Quick stats row */}
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } } }} className="flex flex-wrap gap-4">
        {[
          { label: 'Total', value: total, icon: Plug, color: 'text-[#5E6B3F]', bg: 'bg-[#E2E6D5]' },
          { label: 'Connected', value: connected, icon: CheckCircle, color: 'text-[#567D46]', bg: 'bg-[#567D46]/10' },
          { label: 'Syncing', value: syncing, icon: Clock, color: 'text-[#C68A32]', bg: 'bg-[#C68A32]/10' },
        ].map((stat) => (
          <div key={stat.label} className="card-sand flex items-center gap-3 px-4 py-3 min-w-[140px]">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
            </div>
            <div>
              <div className="font-display text-lg font-semibold text-[#2B2A26]">{stat.value}</div>
              <div className="text-[10px] font-mono text-[#8A857D]">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Source grid */}
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15 } } }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#2B2A26]">All sources</h2>
          {connectors && (
            <span className="text-[11px] font-mono text-[#8A857D]">{connected}/{total} connected</span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connectors?.map((c, i) => (
            <motion.div
              key={c.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <ConnectorCard conn={c} />
            </motion.div>
          ))}
          {(!connectors || connectors.length === 0) && (
            <div className="card-sand col-span-full flex flex-col items-center py-16 text-center">
              <Plug className="h-12 w-12 text-[#8A857D]/30 mb-4" />
              <p className="text-sm text-[#6D685F]">No sources configured yet.</p>
              <p className="mt-1 text-xs text-[#8A857D]">Connect your first source to start indexing knowledge.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
