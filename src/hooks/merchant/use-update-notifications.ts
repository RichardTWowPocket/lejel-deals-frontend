'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { UpdateNotificationsDto } from '@/types/settings'

export function useUpdateNotifications() {
  const queryClient = useQueryClient()
  const { activeMerchantId } = useMerchant()

  return useMutation<any, Error, UpdateNotificationsDto>({
    mutationFn: async (data: UpdateNotificationsDto) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      // Note: Backend endpoint may need to be created: PATCH /merchants/:id/notifications
      // For now, we'll use the general update endpoint
      const response = await api.patch<ApiResponse<any>>(
        `/merchants/${activeMerchantId}`,
        { notifications: data }
      )
      return response.data.data
    },
    onSuccess: () => {
      if (activeMerchantId) {
        queryClient.invalidateQueries({ queryKey: merchantKeys.settings.notifications(activeMerchantId) })
      }
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.settings.all, exact: false })
      toast.success('Notification preferences updated successfully!')
    },
    onError: (error) => handleApiError(error, { action: 'updateNotifications' }),
  })
}



