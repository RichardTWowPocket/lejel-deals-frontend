'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { RedemptionStats } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useRedemptionStats() {
  const { activeMerchantId } = useMerchant()

  return useQuery<RedemptionStats, Error>({
    queryKey: merchantKeys.redemptions.stats(),
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
    staleTime: 30 * 1000, // 30 seconds (real-time dashboard data)
    gcTime: 2 * 60 * 1000, // 2 minutes (garbage collection)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}



