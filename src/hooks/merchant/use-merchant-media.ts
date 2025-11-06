'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import type { ApiResponse } from '@/types/common'
import type { MediaListResponse, MediaFilters, Media } from '@/types/media'

export function useMerchantMedia(filters?: MediaFilters) {
  const { activeMerchantId } = useMerchant()

  return useQuery<MediaListResponse, Error>({
    queryKey: merchantKeys.media.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
      }

      // Backend filters by uploadedBy (user ID), not merchantId directly
      // The merchantId is used for context, but filtering is done by user
      const response = await api.get<ApiResponse<MediaListResponse>>(
        `/media?${params.toString()}`
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

export function useMedia(mediaId: string | undefined) {
  return useQuery({
    queryKey: merchantKeys.media.detail(mediaId || ''),
    queryFn: async () => {
      if (!mediaId) {
        throw new Error('Media ID is required')
      }
      const response = await api.get<ApiResponse<Media>>(`/media/${mediaId}`)
      return response.data.data
    },
    enabled: !!mediaId,
    staleTime: 5 * 60 * 1000, // 5 minutes (less frequently changing details)
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  })
}

