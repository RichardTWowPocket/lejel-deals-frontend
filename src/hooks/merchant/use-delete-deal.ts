'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'

/**
 * Delete Deal Mutation Hook
 * 
 * Deletes a deal (soft delete on backend).
 * Invalidates deals list and overview queries on success.
 * 
 * @example
 * ```tsx
 * const deleteDeal = useDeleteDeal()
 * 
 * deleteDeal.mutate('deal-123')
 * ```
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/deals/${id}`)
    },
    onSuccess: () => {
      // Invalidate all deal queries (including all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all, exact: false })
      // Invalidate overview (might show deal count, active deals list)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
      
      toast.success('Deal deleted successfully')
      
      // Redirect to deals list
      router.push('/merchant/deals')
    },
    onError: (error) => {
      handleApiError(error, { action: 'deleteDeal', resource: 'deal' })
    },
  })
}



