'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { RedemptionListResponse, RedemptionFilters } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useMerchantRedemptions(filters?: RedemptionFilters) {
  const { activeMerchantId } = useMerchant()

  // Memoize and normalize query key to ensure stability
  // Normalize filters to remove undefined values and ensure consistent serialization
  const queryKey = useMemo(() => {
    // Normalize filters: remove undefined values and ensure consistent format
    const normalizedFilters: any = {
      merchantId: activeMerchantId,
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Normalize dates to ISO strings for consistency
          if (key === 'startDate' || key === 'endDate') {
            normalizedFilters[key] = new Date(value).toISOString()
          } else {
            normalizedFilters[key] = value
          }
        }
      })
    }
    
    return merchantKeys.redemptions.list(normalizedFilters)
  }, [
    filters?.page,
    filters?.limit,
    filters?.startDate,
    filters?.endDate,
    filters?.status,
    filters?.search,
    activeMerchantId,
  ])

  return useQuery<RedemptionListResponse, Error>({
    queryKey,
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
    staleTime: 2 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 5 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Respect global setting - don't refetch on window focus
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnReconnect: true, // Still refetch on reconnect
  })
}


