'use client'

import { useQuery } from '@tanstack/react-query'
import { useMerchant } from '@/lib/merchant-context'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Deal, DealFilters, DealListResponse } from '@/types/deal'
import type { ApiResponse } from '@/types/common'

/**
 * Merchant Deals Query Hook
 * 
 * Fetches deals for the active merchant with filters and pagination.
 * Uses URL-synced filters and merchant context.
 * 
 * @example
 * ```tsx
 * const { filters } = useMerchantFilters<DealFilters>({ defaults: { status: 'ACTIVE', page: 1, limit: 10 } })
 * const { data, isLoading, error } = useMerchantDeals(filters)
 * ```
 */
export function useMerchantDeals(filters?: DealFilters) {
  const { activeMerchantId } = useMerchant()

  return useQuery({
    queryKey: merchantKeys.deals.filters(filters),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected')
      }

      const params = new URLSearchParams()
      
      // Always include merchantId
      params.append('merchantId', activeMerchantId)
      
      // Add filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
      }

      const response = await api.get<ApiResponse<DealListResponse>>(
        `/deals?${params.toString()}`
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

/**
 * Single Deal Query Hook
 * 
 * Fetches a single deal by ID.
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useMerchantDeal(dealId)
 * ```
 */
export function useMerchantDeal(dealId: string | undefined) {
  return useQuery({
    queryKey: merchantKeys.deals.detail(dealId || ''),
    queryFn: async () => {
      if (!dealId) {
        throw new Error('Deal ID is required')
      }

      const response = await api.get<ApiResponse<Deal>>(`/deals/${dealId}`)
      return response.data.data
    },
    enabled: !!dealId,
    staleTime: 5 * 60 * 1000, // 5 minutes (less frequently changing details)
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  })
}



