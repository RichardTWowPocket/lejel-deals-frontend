'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import type { ApiResponse } from '@/types/common'
import type { PayoutResponse, PayoutPeriod } from '@/types/payout'

export function useMerchantPayouts(period: PayoutPeriod = 'all') {
  const { activeMerchantId } = useMerchant()

  return useQuery<PayoutResponse, Error>({
    queryKey: merchantKeys.payouts.list(period),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const params = new URLSearchParams()
      params.append('period', period)
      if (activeMerchantId) {
        params.append('merchantId', activeMerchantId)
      }

      const response = await api.get<ApiResponse<PayoutResponse>>(
        `/merchants/me/payouts?${params.toString()}`
      )
      return response.data.data
    },
    enabled: !!activeMerchantId,
    staleTime: 60 * 1000, // 1 minute (frequently changing lists)
    gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection)
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
  })
}

