'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Deal } from '@/types/deal'
import type { ApiResponse } from '@/types/common'

export interface CreateDealDto {
  title: string
  description?: string
  dealPrice: number
  discountPrice: number
  originalPrice?: number
  merchantId: string
  categoryId?: string
  validFrom: string
  validUntil: string
  maxQuantity?: number
  images?: string[]
  terms?: string
  featured?: boolean
  status?: 'DRAFT' | 'ACTIVE'
}

/**
 * Create Deal Mutation Hook
 * 
 * Creates a new deal for the merchant.
 * Invalidates deals list and overview queries on success.
 * 
 * @example
 * ```tsx
 * const createDeal = useCreateDeal()
 * 
 * createDeal.mutate({
 *   title: 'New Deal',
 *   dealPrice: 50000,
 *   discountPrice: 100000,
 *   merchantId: activeMerchantId,
 *   validFrom: '2024-12-01',
 *   validUntil: '2024-12-31',
 * })
 * ```
 */
export function useCreateDeal() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: CreateDealDto): Promise<Deal> => {
      const response = await api.post<ApiResponse<Deal>>('/deals', data)
      return response.data.data
    },
    onSuccess: (deal) => {
      // Invalidate all deal queries (including all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all, exact: false })
      // Invalidate overview (might show deal count, active deals list)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
      
      toast.success('Deal created successfully')
      
      // Redirect to deals list
      router.push('/merchant/deals')
    },
    onError: (error) => {
      handleApiError(error, { action: 'createDeal', resource: 'deal' })
    },
  })
}



