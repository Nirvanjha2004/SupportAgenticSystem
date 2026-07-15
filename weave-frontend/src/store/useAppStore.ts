import { create } from 'zustand'

interface Workspace { id: string; name: string }

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  activeWorkspace: Workspace | null
  setActiveWorkspace: (w: Workspace) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  activeWorkspace: { id: 'ws-1', name: 'Acme Corp' },
  setActiveWorkspace: (w) => set({ activeWorkspace: w }),
}))
