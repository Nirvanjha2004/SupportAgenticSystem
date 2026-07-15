import { NavLink, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import {
  MessageSquare,
  Plug,
  FileText,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'

const nav = [
  { to: '/ask', label: 'Ask', icon: MessageSquare },
  { to: '/sources', label: 'Sources', icon: Plug },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggle = useAppStore((s) => s.toggleSidebar)
  const workspace = useAppStore((s) => s.activeWorkspace)
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      className="flex flex-col border-r border-line bg-surface"
    >
      <div className="flex h-14 items-center justify-between px-3 border-b border-line">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-btn bg-accent flex items-center justify-center text-white font-bold text-sm">
              {workspace?.name?.[0] || 'W'}
            </div>
            <span className="truncate text-sm font-medium text-text-primary">
              {workspace?.name}
            </span>
          </div>
        )}
        <button
          onClick={toggle}
          className="ml-auto rounded-btn p-1 text-text-muted hover:text-text-primary hover:bg-surface-raised"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 py-3 px-2 space-y-1">
        {nav.map((item) => {
          const active = location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-btn px-2 py-2 text-sm transition-colors ${
                active
                  ? 'bg-accent-soft text-accent'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </div>

      {!collapsed && (
        <div className="p-3 border-t border-line">
          <div className="mb-2 text-xs font-mono text-text-muted">Usage</div>
          <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: '24%' }}
            />
          </div>
          <div className="mt-1 text-[10px] font-mono text-text-muted">
            12,400 / 50,000 chunks
          </div>
        </div>
      )}

      <div className="flex h-14 items-center gap-2 border-t border-line px-3">
        <div className="h-8 w-8 rounded-full bg-surface-raised" />
        {!collapsed && <span className="text-sm text-text-muted">You</span>}
      </div>
    </motion.aside>
  )
}
