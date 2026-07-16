import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Workspace { id: string; name: string }

interface User {
  id: string
  name: string
  email: string
}

interface AppState {
  // Sidebar state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  
  // Workspace state
  activeWorkspace: Workspace | null
  setActiveWorkspace: (w: Workspace) => void
  
  // Auth state
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      
      // Workspace
      activeWorkspace: { id: 'ws-1', name: 'Acme Corp' },
      setActiveWorkspace: (w) => set({ activeWorkspace: w }),
      
      // Auth
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'weave-app-storage', // name of the local storage key
    }
  )
)
