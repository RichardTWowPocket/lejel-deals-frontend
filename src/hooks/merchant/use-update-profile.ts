'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { UpdateProfileDto } from '@/types/settings'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { activeMerchantId } = useMerchant()

  return useMutation<any, Error, UpdateProfileDto>({
    mutationFn: async (data: UpdateProfileDto) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.patch<ApiResponse<any>>(
        `/merchants/${activeMerchantId}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.settings.all, exact: false })
      // Invalidate overview (merchant name/logo might change)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
      toast.success('Profile updated successfully!')
    },
    onError: (error) => handleApiError(error, { action: 'updateProfile' }),
  })
}



