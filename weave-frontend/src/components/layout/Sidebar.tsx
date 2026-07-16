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
      className="flex flex-col border-r border-[#DDD5C8] bg-[#FBF9F5]"
    >
      <div className="flex h-14 items-center justify-between border-b border-[#DDD5C8] px-3">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-[#5E6B3F] text-sm font-bold text-[#FBF9F5]">
              {workspace?.name?.[0] || 'W'}
            </div>
            <span className="truncate text-sm font-medium text-[#2B2A26]">
              {workspace?.name}
            </span>
          </div>
        )}
        <button
          onClick={toggle}
          className="ml-auto rounded-btn p-1 text-[#8A857D] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 space-y-1 px-2 py-3">
        {nav.map((item) => {
          const active = location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-btn px-2 py-2 text-sm transition-colors ${
                active
                  ? 'bg-[#E2E6D5] text-[#5E6B3F]'
                  : 'text-[#6D685F] hover:bg-[#EEE7DA] hover:text-[#2B2A26]'
              }`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </div>

      {!collapsed && (
        <div className="border-t border-[#DDD5C8] p-3">
          <div className="mb-2 text-[10px] font-mono text-[#8A857D]">Usage</div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#DDD5C8]">
            <div className="h-full rounded-full bg-[#5E6B3F]" style={{ width: '24%' }} />
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#8A857D]">12,400 / 50,000 chunks</div>
        </div>
      )}

      <div className="flex h-14 items-center gap-2 border-t border-[#DDD5C8] px-3">
        <div className="h-8 w-8 rounded-full bg-[#EEE7DA]" />
        {!collapsed && <span className="text-sm text-[#6D685F]">You</span>}
      </div>
    </motion.aside>
  )
}
