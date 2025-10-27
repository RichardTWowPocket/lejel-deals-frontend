import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiResponse } from '@/types/common'

export interface ServerTimeResponse {
  serverTime: string
  timezone: string
}

/**
 * Hook to get server time for countdown sync
 * Fetches server time every 60 seconds to keep countdowns accurate
 */
export function useServerTime() {
  return useQuery({
    queryKey: ['server-time'],
    queryFn: async () => {
      // For now, return current time since we don't have a server time endpoint
      // In production, this would call: /api/system/time
      return {
        serverTime: new Date().toISOString(),
        timezone: 'Asia/Jakarta',
        clientTime: new Date().toISOString(),
      }
    },
    staleTime: 60 * 1000, // Refresh every 60 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
  })
}

/**
 * Hook to calculate time offset between client and server
 */
export function useTimeOffset() {
  const { data: serverTimeData } = useServerTime()

  if (!serverTimeData) return 0

  const serverTime = new Date(serverTimeData.serverTime).getTime()
  const clientTime = new Date().getTime()

  return serverTime - clientTime // Positive means server is ahead
}

