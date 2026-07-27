import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import { useAppStore } from '../store/useAppStore'

export interface ConnectorStatus {
  type: 'slack' | 'google_docs' | 'notion'
  name: string
  connected: boolean
  status: 'idle' | 'syncing' | 'error' | 'synced'
  lastSynced?: string
  docCount?: number
  progress?: number
}

export function useConnectors() {
  const workspaceId = useAppStore((state) => state.activeWorkspace?.id)
  type ConnectorApiRecord = {
    type: ConnectorStatus['type']
    name: string
    connected: boolean
    status: ConnectorStatus['status']
    last_synced?: string
    doc_count?: number
    progress?: number
  }

  return useQuery<ConnectorStatus[]>({
    queryKey: ['connectors', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return []
      const data = await apiFetch(`/connectors?workspace_id=${encodeURIComponent(workspaceId)}`) as ConnectorApiRecord[]
      // Map snake_case to camelCase
      return data.map((item) => ({
        ...item,
        lastSynced: item.last_synced,
        docCount: item.doc_count,
      }))
    },
    enabled: !!workspaceId,
  })
}
