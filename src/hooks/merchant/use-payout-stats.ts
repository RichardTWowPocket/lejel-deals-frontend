'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import type { ApiResponse } from '@/types/common'
import type { PayoutStats, PayoutResponse } from '@/types/payout'

export function usePayoutStats() {
  const { activeMerchantId } = useMerchant()

  return useQuery<PayoutStats, Error>({
    queryKey: merchantKeys.payouts.stats(),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      // Get current month stats
      const params = new URLSearchParams()
      params.append('period', 'month')
      if (activeMerchantId) {
        params.append('merchantId', activeMerchantId)
      }

      const response = await api.get<ApiResponse<PayoutResponse>>(
        `/merchants/me/payouts?${params.toString()}`
      )
      const data = response.data.data

      // Calculate stats from summary
      return {
        totalRevenue: data.summary?.totalRevenue || 0,
        totalOrders: data.summary?.totalOrders || 0,
        averageOrderValue: data.summary?.averageOrderValue || 0,
      }
    },
    enabled: !!activeMerchantId,
    staleTime: 30 * 1000, // 30 seconds (real-time dashboard data)
    gcTime: 2 * 60 * 1000, // 2 minutes (garbage collection)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

