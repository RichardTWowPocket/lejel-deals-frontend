'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import type { ApiResponse } from '@/types/common'
import type { MerchantProfile, MerchantBusiness, OperatingHoursDto } from '@/types/settings'

export interface MerchantSettingsData {
  id: string
  name: string
  email: string
  phone?: string
  logo?: string
  description?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  website?: string
  operatingHours?: OperatingHoursDto[]
  createdAt: string
  updatedAt: string
}

export function useMerchantSettings() {
  const { activeMerchantId } = useMerchant()

  return useQuery<MerchantSettingsData, Error>({
    queryKey: merchantKeys.settings.me(activeMerchantId),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.get<ApiResponse<MerchantSettingsData>>(
        `/merchants/${activeMerchantId}`
      )
      return response.data.data
    },
    enabled: !!activeMerchantId,
    staleTime: 10 * 60 * 1000, // 10 minutes (settings rarely change)
    gcTime: 15 * 60 * 1000, // 15 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export function useOperatingHours() {
  const { activeMerchantId } = useMerchant()

  return useQuery<{ merchantId: string; operatingHours: OperatingHoursDto[] }, Error>({
    queryKey: merchantKeys.settings.operatingHours(activeMerchantId),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.get<ApiResponse<{ merchantId: string; operatingHours: OperatingHoursDto[] }>>(
        `/merchants/${activeMerchantId}/operating-hours`
      )
      return response.data.data
    },
    enabled: !!activeMerchantId,
    staleTime: 10 * 60 * 1000, // 10 minutes (settings rarely change)
    gcTime: 15 * 60 * 1000, // 15 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}



