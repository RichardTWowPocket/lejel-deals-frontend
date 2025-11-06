'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { OperatingHoursDto } from '@/types/settings'

export function useUpdateHours() {
  const queryClient = useQueryClient()
  const { activeMerchantId } = useMerchant()

  return useMutation<any, Error, OperatingHoursDto[]>({
    mutationFn: async (operatingHours: OperatingHoursDto[]) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.patch<ApiResponse<any>>(
        `/merchants/${activeMerchantId}/operating-hours`,
        { operatingHours }
      )
      return response.data.data
    },
    onSuccess: () => {
      if (activeMerchantId) {
        queryClient.invalidateQueries({ queryKey: merchantKeys.settings.operatingHours(activeMerchantId) })
      }
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.settings.all, exact: false })
      toast.success('Operating hours updated successfully!')
    },
    onError: (error) => handleApiError(error, { action: 'updateOperatingHours' }),
  })
}

