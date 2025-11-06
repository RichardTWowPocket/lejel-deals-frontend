'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { RedemptionListResponse, RedemptionFilters } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useMerchantRedemptions(filters?: RedemptionFilters) {
  const { activeMerchantId } = useMerchant()

  return useQuery<RedemptionListResponse, Error>({
    queryKey: merchantKeys.redemptions.list({ ...filters, merchantId: activeMerchantId }),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const params = new URLSearchParams()
      
      // Add merchant ID
      params.append('merchantId', activeMerchantId)
      
      // Add other filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'startDate' || key === 'endDate') {
              // Format dates as ISO strings
              params.append(key, new Date(value).toISOString())
            } else {
              params.append(key, String(value))
            }
          }
        })
      }

      // Default pagination if not provided
      if (!filters?.page) params.append('page', '1')
      if (!filters?.limit) params.append('limit', '10')

      const response = await api.get<ApiResponse<RedemptionListResponse>>(
        `/redemptions?${params.toString()}`
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



