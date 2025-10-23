import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Merchant, MerchantFilters, MerchantListResponse } from '@/types/merchant'
import { ApiResponse } from '@/types/common'

export function useMerchants(filters?: MerchantFilters) {
  return useQuery({
    queryKey: ['merchants', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }

      const response = await api.get<ApiResponse<MerchantListResponse>>(
        `/merchants?${params.toString()}`,
      )
      console.log('Merchants API response:', response.data)
      
      const data = response.data.data
      
      // If data is an array, wrap it in the expected format
      if (Array.isArray(data)) {
        return {
          merchants: data,
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

export function useMerchant(slug: string) {
  return useQuery({
    queryKey: ['merchant', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Merchant>>(`/merchants/${slug}`)
      return response.data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedMerchants(limit: number = 6) {
  return useQuery({
    queryKey: ['merchants', 'featured', limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<MerchantListResponse>>(
        `/merchants?featured=true&limit=${limit}&verified=true`,
      )
      console.log('Featured merchants API response:', response.data)
      
      const data = response.data.data
      
      // If data is an array, wrap it in the expected format
      if (Array.isArray(data)) {
        return {
          merchants: data,
          pagination: {
            page: 1,
            limit: limit,
            total: data.length,
            totalPages: Math.ceil(data.length / limit)
          }
        }
      }
      
      // If data is already in the expected format, return it
      return data
    },
  })
}

