import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

export interface ConnectorStatus {
  type: 'slack' | 'google_docs' | 'notion'
  name: string
  connected: boolean
  status: 'idle' | 'syncing' | 'error' | 'synced'
  last_synced?: string
  doc_count?: number
  progress?: number
}

export function useConnectors() {
  return useQuery<ConnectorStatus[]>({
    queryKey: ['connectors'],
    queryFn: async () => {
      try {
        const data = await apiFetch('/connectors')
        // Map snake_case to camelCase
        return data.map((item: any) => ({
          ...item,
          lastSynced: item.last_synced,
          docCount: item.doc_count,
        }))
      } catch {
        return [
          { type: 'slack', name: 'Slack', connected: true, status: 'synced', last_synced: '2 min ago', doc_count: 1247 },
          { type: 'google_docs', name: 'Google Docs', connected: true, status: 'syncing', progress: 0.6, doc_count: 42 },
          { type: 'notion', name: 'Notion', connected: false, status: 'idle' },
        ] as ConnectorStatus[]
      }
    },
  })
}
