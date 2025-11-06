'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Deal } from '@/types/deal'
import type { ApiResponse } from '@/types/common'

export interface UpdateDealDto {
  title?: string
  description?: string
  dealPrice?: number
  discountPrice?: number
  originalPrice?: number
  categoryId?: string
  validFrom?: string
  validUntil?: string
  maxQuantity?: number
  images?: string[]
  terms?: string
  featured?: boolean
}

/**
 * Update Deal Mutation Hook
 * 
 * Updates an existing deal.
 * Invalidates specific deal and list queries on success.
 * 
 * @example
 * ```tsx
 * const updateDeal = useUpdateDeal()
 * 
 * updateDeal.mutate({
 *   id: 'deal-123',
 *   data: { title: 'Updated Title' }
 * })
 * ```
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDealDto }): Promise<Deal> => {
      const response = await api.patch<ApiResponse<Deal>>(`/deals/${id}`, data)
      return response.data.data
    },
    onSuccess: (deal, variables) => {
      // Invalidate specific deal
      queryClient.invalidateQueries({ queryKey: merchantKeys.deals.detail(variables.id) })
      // Invalidate all deal lists (including all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all, exact: false })
      // Invalidate overview (might show deal count, active deals list, low inventory alerts)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
      
      toast.success('Deal updated successfully')
    },
    onError: (error) => {
      handleApiError(error, { action: 'updateDeal', resource: 'deal' })
    },
  })
}



