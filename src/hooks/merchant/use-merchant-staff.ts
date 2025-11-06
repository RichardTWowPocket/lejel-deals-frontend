'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import type { ApiResponse } from '@/types/common'
import type { StaffListResponse } from '@/types/staff'

export function useMerchantStaff() {
  const { activeMerchantId } = useMerchant()

  return useQuery<StaffListResponse, Error>({
    queryKey: merchantKeys.staff.list(),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const params = new URLSearchParams()
      params.append('merchantId', activeMerchantId)

      const response = await api.get<ApiResponse<StaffListResponse>>(
        `/staff?${params.toString()}`
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



