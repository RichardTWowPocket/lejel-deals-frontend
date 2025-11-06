'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Deal } from '@/types/deal'
import type { ApiResponse } from '@/types/common'
import type { DealFilters } from '@/types/deal'

export type DealStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT'

/**
 * Toggle Deal Status Mutation Hook
 * 
 * Updates deal status with optimistic updates for better UX.
 * Supports ACTIVE <-> PAUSED transitions.
 * 
 * @example
 * ```tsx
 * const toggleStatus = useToggleDealStatus()
 * 
 * toggleStatus.mutate({
 *   id: 'deal-123',
 *   status: 'PAUSED'
 * })
 * ```
 */
export function useToggleDealStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DealStatus }): Promise<Deal> => {
      const response = await api.patch<ApiResponse<Deal>>(`/deals/${id}/status`, { status })
      return response.data.data
    },
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: merchantKeys.deals.all })

      // Snapshot previous values for all deal queries
      const previousQueries: Array<{ queryKey: readonly unknown[]; data: unknown }> = []
      
      // Get all deal queries from cache
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (merchantKeys.deals.all.every((key, i) => query.queryKey[i] === key)) {
          previousQueries.push({
            queryKey: query.queryKey,
            data: query.state.data,
          })
        }
      })

      // Optimistically update all deal lists
      queryClient.setQueriesData(
        { queryKey: merchantKeys.deals.all, exact: false },
        (old: any) => {
          if (!old) return old

          // Handle different response shapes
          const deals = old.deals || old.data || old.items || []
          const updatedDeals = deals.map((deal: Deal) =>
            deal.id === id ? { ...deal, status } : deal
          )

          // Return updated structure
          if (old.deals) {
            return { ...old, deals: updatedDeals }
          }
          if (old.data) {
            return { ...old, data: updatedDeals }
          }
          if (old.items) {
            return { ...old, items: updatedDeals }
          }
          return old
        }
      )

      // Optimistically update specific deal
      queryClient.setQueryData(merchantKeys.deals.detail(id), (old: Deal | undefined) => {
        if (!old) return old
        return { ...old, status }
      })

      return { previousQueries }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      handleApiError(err, { action: 'toggleDealStatus', resource: 'deal', dealId: variables.id })
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status === 'ACTIVE' ? 'activated' : 'paused'
      toast.success(`Deal ${statusText} successfully`)
    },
    onSettled: () => {
      // Refetch to ensure consistency (invalidate all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all, exact: false })
      // Invalidate overview (active deals count might change)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
    },
  })
}

/**
 * Pause Deal Hook
 * 
 * Convenience hook for pausing a deal.
 */
export function usePauseDeal() {
  const toggleStatus = useToggleDealStatus()
  
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, status: 'PAUSED' }),
    mutateAsync: (id: string) => toggleStatus.mutateAsync({ id, status: 'PAUSED' }),
  }
}

/**
 * Resume/Activate Deal Hook
 * 
 * Convenience hook for activating a deal.
 */
export function useResumeDeal() {
  const toggleStatus = useToggleDealStatus()
  
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, status: 'ACTIVE' }),
    mutateAsync: (id: string) => toggleStatus.mutateAsync({ id, status: 'ACTIVE' }),
  }
}



