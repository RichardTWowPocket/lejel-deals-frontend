'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { OrderStats } from '@/types/order'
import { ApiResponse } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useOrderStats() {
  const { activeMerchantId } = useMerchant()

  return useQuery<OrderStats, Error>({
    queryKey: merchantKeys.orders.stats(),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      // Note: Backend /orders/stats endpoint doesn't currently accept merchantId parameter
      // TODO: Update backend to support merchant-scoped stats
      // For now, this will return global stats (not merchant-specific)
      const response = await api.get<ApiResponse<OrderStats>>('/orders/stats')
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

