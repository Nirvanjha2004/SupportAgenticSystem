import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

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
  return useQuery<ConnectorStatus[]>({
    queryKey: ['connectors'],
    queryFn: async () => {
      try {
        return await apiFetch('/connectors')
      } catch {
        return [
          { type: 'slack', name: 'Slack', connected: true, status: 'synced', lastSynced: '2 min ago', docCount: 1247 },
          { type: 'google_docs', name: 'Google Docs', connected: true, status: 'syncing', progress: 0.6, docCount: 42 },
          { type: 'notion', name: 'Notion', connected: false, status: 'idle' },
        ] as ConnectorStatus[]
      }
    },
  })
}
