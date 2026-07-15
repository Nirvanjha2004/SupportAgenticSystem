import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

export interface IngestionJob {
  id: string
  sourceType: string
  stage: 'fetching' | 'chunking' | 'embedding' | 'stored'
  progress: number
  message: string
  timestamp: string
}

export function useIngestionStatus(sourceType?: string) {
  return useQuery<IngestionJob[]>({
    queryKey: ['ingestion', sourceType],
    queryFn: async () => {
      if (!sourceType) return []
      try {
        return await apiFetch(`/sources/${sourceType}/jobs`)
      } catch {
        return [] as IngestionJob[]
      }
    },
    refetchInterval: 3000,
    enabled: !!sourceType,
  })
}
