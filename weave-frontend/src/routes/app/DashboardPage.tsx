import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useConnectors } from '../../hooks/useConnectors'
import { ArrowRight, MessageSquare, FileText, Plug, Zap, TrendingUp, Clock } from 'lucide-react'

const ACTIVITY_DATA = [
  { day: 'Mon', queries: 12 },
  { day: 'Tue', queries: 18 },
  { day: 'Wed', queries: 24 },
  { day: 'Thu', queries: 15 },
  { day: 'Fri', queries: 21 },
  { day: 'Sat', queries: 8 },
  { day: 'Sun', queries: 4 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function DashboardPage() {
  const { data: connectors } = useConnectors()

  const connected = connectors?.filter((c) => c.connected).length ?? 0
  const totalDocs = connectors?.reduce((sum, c) => sum + (c.docCount ?? 0), 0) ?? 0
  const totalQueries = ACTIVITY_DATA.reduce((sum, d) => sum + d.queries, 0)
  const maxQueries = Math.max(...ACTIVITY_DATA.map(d => d.queries))

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl space-y-8"
    >
      <motion.div variants={itemVariants}>
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
          {greeting}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26] md:text-3xl">
          Welcome back<span className="text-[#5E6B3F]">.</span>
        </h1>
        <p className="mt-1.5 text-sm text-[#6D685F]">
          Here's what's happening across your workspace.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Sources connected', value: connected, icon: Plug, subtitle: 'Active integrations' },
          { label: 'Documents ingested', value: totalDocs.toLocaleString(), icon: FileText, subtitle: 'Across all sources' },
          { label: 'Queries this week', value: totalQueries, icon: TrendingUp, subtitle: 'Since Monday' },
        ].map((stat) => (
          <div key={stat.label} className="card-sand card-sand-hover p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-3xl font-semibold text-[#2B2A26]">{stat.value}</div>
                <div className="mt-1 text-xs font-mono text-[#8A857D]">{stat.label}</div>
                <div className="mt-2 text-[10px] font-mono text-[#6D685F]/60">{stat.subtitle}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2E6D5]">
                <stat.icon className="h-5 w-5 text-[#5E6B3F]" />
              </div>
            </div>
            <div className="mt-4 h-[2px] w-full rounded-full bg-[#E2E6D5]">
              <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#5E6B3F] to-[#A8B18A]" />
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="card-sand p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-[#2B2A26]">Recent activity</h3>
            <a href="/sources" className="group inline-flex items-center gap-1 text-[11px] font-mono text-[#8A857D] transition-colors hover:text-[#5E6B3F]">
              View all
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="space-y-1">
            {connectors?.map((c, i) => (
              <motion.div
                key={c.type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F5F1E8]"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${c.status === 'syncing' ? 'bg-[#C68A32]' : c.status === 'error' ? 'bg-[#A84F3A]' : 'bg-[#567D46]'}`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${c.status === 'syncing' ? 'bg-[#C68A32]' : c.status === 'error' ? 'bg-[#A84F3A]' : c.status === 'idle' ? 'bg-[#8A857D]' : 'bg-[#567D46]'}`} />
                  </span>
                  <div>
                    <span className="text-sm font-medium text-[#2B2A26]">{c.name}</span>
                    <span className="ml-2 text-xs text-[#8A857D]">
                      {c.status === 'syncing' ? `${Math.round((c.progress ?? 0) * 100)}% syncing` : c.status === 'error' ? 'Needs attention' : c.connected ? `${c.docCount} docs indexed` : 'Not connected'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#8A857D]">{c.lastSynced || '---'}</span>
              </motion.div>
            ))}
            {(!connectors || connectors.length === 0) && (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E2E6D5] mb-4">
                  <Plug className="h-6 w-6 text-[#5E6B3F]" />
                </div>
                <p className="text-sm text-[#6D685F]">Nothing connected yet.</p>
                <a href="/sources" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B3F] transition-colors hover:text-[#49552F]">
                  Connect a source
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="card-sand p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-[#2B2A26]">Weekly queries</h3>
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#8A857D]">
              <Clock className="h-3 w-3" />
              This week
            </span>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
            {ACTIVITY_DATA.map((d) => (
              <div key={d.day} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.queries / maxQueries) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#5E6B3F] to-[#A8B18A] opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="mt-2 text-[10px] font-mono text-[#8A857D]">{d.day}</span>
                <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="whitespace-nowrap rounded-md bg-[#2B2A26] px-2 py-1 text-[10px] font-mono text-[#FBF9F5]">{d.queries} queries</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[#DDD5C8]/50 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6D685F]">Total this week</span>
              <span className="font-semibold text-[#2B2A26]">{totalQueries} queries</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-[#2B2A26]">Source overview</h3>
          <a href="/sources" className="group inline-flex items-center gap-1 text-[11px] font-mono text-[#8A857D] transition-colors hover:text-[#5E6B3F]">
            Manage sources
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {connectors?.map((c, i) => (
            <motion.div
              key={c.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="card-sand card-sand-hover p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.connected ? 'bg-[#E2E6D5]' : 'bg-[#F5F1E8]'}`}>
                  <MessageSquare className={`h-5 w-5 ${c.connected ? 'text-[#5E6B3F]' : 'text-[#8A857D]'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2B2A26]">{c.name}</h4>
                  <span className={`text-[10px] font-mono ${c.status === 'syncing' ? 'text-[#C68A32]' : c.status === 'error' ? 'text-[#A84F3A]' : c.connected ? 'text-[#567D46]' : 'text-[#8A857D]'}`}>
                    {c.status === 'syncing' ? 'Syncing' : c.status === 'error' ? 'Error' : c.connected ? 'Connected' : 'Pending'}
                  </span>
                </div>
              </div>
              {c.status === 'syncing' && c.progress !== undefined && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DDD5C8]">
                  <motion.div className="h-full rounded-full bg-[#5E6B3F]" animate={{ width: `${c.progress * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
              )}
              {c.connected && c.status !== 'syncing' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A857D]">Documents</span>
                    <span className="font-mono text-[#2B2A26]">{c.docCount?.toLocaleString() ?? 0}</span>
                  </div>
                  {c.lastSynced && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8A857D]">Last sync</span>
                      <span className="font-mono text-[#2B2A26]">{c.lastSynced}</span>
                    </div>
                  )}
                </div>
              )}
              {!c.connected && (
                <a href="/sources" className="group mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#5E6B3F] transition-colors hover:text-[#49552F]">
                  <Zap className="h-3 w-3" />
                  Connect
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="card-sand p-5">
        <h3 className="font-display text-base font-semibold text-[#2B2A26]">Quick actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { href: '/ask', label: 'Ask a question', icon: MessageSquare },
            { href: '/sources', label: 'Connect source', icon: Plug },
            { href: '/documents', label: 'Browse documents', icon: FileText },
          ].map((action) => (
            <a key={action.href} href={action.href}
              className="group inline-flex items-center gap-2 rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-4 py-2.5 text-sm font-medium text-[#2B2A26] transition-all duration-300 hover:border-[#C5BBAA] hover:shadow-soft">
              <action.icon className="h-4 w-4 text-[#5E6B3F]" />
              {action.label}
              <ArrowRight className="h-3.5 w-3.5 text-[#8A857D] transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
