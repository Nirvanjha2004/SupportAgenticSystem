import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import { useAppStore } from '../store/useAppStore'

export interface IngestionJob {
  id: string
  sourceType: string
  stage: 'fetching' | 'chunking' | 'embedding' | 'stored'
  progress: number
  message: string
  timestamp: string
}

export function useIngestionStatus(sourceType?: string) {
  const workspaceId = useAppStore((state) => state.activeWorkspace?.id)

  return useQuery<IngestionJob[]>({
    queryKey: ['ingestion', sourceType, workspaceId],
    queryFn: async () => {
      if (!sourceType || !workspaceId) return []
      try {
        return await apiFetch(`/sources/${sourceType}/jobs?workspace_id=${encodeURIComponent(workspaceId)}`)
      } catch {
        return [] as IngestionJob[]
      }
    },
    refetchInterval: 3000,
    enabled: !!sourceType && !!workspaceId,
  })
}
