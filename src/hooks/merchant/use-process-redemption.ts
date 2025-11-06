'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { RedemptionResponse, ProcessRedemptionDto } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { handleApiError } from '@/lib/error-handler'
import { merchantKeys } from '@/lib/query-keys'
import toast from 'react-hot-toast'

export function useProcessRedemption() {
  const queryClient = useQueryClient()

  return useMutation<RedemptionResponse, Error, ProcessRedemptionDto>({
    mutationFn: async (data: ProcessRedemptionDto) => {
      const response = await api.post<ApiResponse<RedemptionResponse>>(
        '/redemptions/process',
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate all redemption queries (including all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.redemptions.all, exact: false })
      // Invalidate redemption stats
      queryClient.invalidateQueries({ queryKey: merchantKeys.redemptions.stats() })
      // Invalidate overview (today's redemptions count changes)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
      // Invalidate order stats (might affect order completion rates)
      queryClient.invalidateQueries({ queryKey: merchantKeys.orders.stats() })
      toast.success('Redemption processed successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'processRedemption' })
      toast.error('Failed to process redemption. Please try again.')
    },
  })
}



