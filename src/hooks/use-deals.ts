import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Deal, DealFilters, DealListResponse } from '@/types/deal'
import { ApiResponse } from '@/types/common'
import { dealKeys } from '@/lib/query-keys'

export function useDeals(filters?: DealFilters) {
  return useQuery({
    queryKey: dealKeys.lists(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }

      const response = await api.get<ApiResponse<DealListResponse>>(
        `/deals?${params.toString()}`,
      )
      
      // Handle both array format and object format
      const data = response.data.data

      console.log('Data:', data)
      
      // If data is an array, wrap it in the expected format
      if (Array.isArray(data)) {
        console.log('Processing array of deals:', data)
        return {
          deals: data,
          pagination: {
            page: filters?.page || 1,
            limit: filters?.limit || 12,
            total: data.length,
            totalPages: Math.ceil(data.length / (filters?.limit || 12))
          }
        }
      }
      
      // If data is already in the expected format, return it
      return data
    },
  })
}

export function useDeal(slug: string) {
  return useQuery({
    queryKey: dealKeys.detail(slug),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Deal>>(`/deals/${slug}`)
      return response.data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedDeals(limit: number = 6) {
  return useQuery({
    queryKey: dealKeys.featured(limit),
    queryFn: async () => {
      const response = await api.get<ApiResponse<DealListResponse>>(
        `/deals?featured=true&limit=${limit}&status=ACTIVE`,
      )
      return response.data.data
    },
  })
}

