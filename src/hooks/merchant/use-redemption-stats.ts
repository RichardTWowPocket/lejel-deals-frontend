'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { RedemptionStats } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useRedemptionStats() {
  const { activeMerchantId } = useMerchant()

  // Include merchantId in query key for proper cache isolation
  const queryKey = useMemo(() => {
    return [...merchantKeys.redemptions.stats(), activeMerchantId]
  }, [activeMerchantId])

  return useQuery<RedemptionStats, Error>({
    queryKey,
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.get<ApiResponse<RedemptionStats>>(
        `/redemptions/stats?merchantId=${activeMerchantId}`
      )
      return response.data.data
    },
    enabled: !!activeMerchantId,
    staleTime: 2 * 60 * 1000, // 2 minutes - stats are considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Respect global setting - don't refetch on window focus
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnReconnect: true, // Still refetch on reconnect
  })
}



