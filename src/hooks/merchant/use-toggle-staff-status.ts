'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Staff } from '@/types/staff'
import type { ApiResponse } from '@/types/common'

/**
 * Toggle Staff Status Mutation Hook
 * 
 * Updates staff active/inactive status with optimistic updates for better UX.
 * 
 * @example
 * ```tsx
 * const toggleStatus = useToggleStaffStatus()
 * 
 * toggleStatus.mutate({
 *   id: 'staff-123',
 *   isActive: false
 * })
 * ```
 */
export function useToggleStaffStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<Staff> => {
      // Use activate/deactivate endpoints
      const endpoint = isActive ? `/staff/${id}/activate` : `/staff/${id}/deactivate`
      
      const response = await api.patch<ApiResponse<Staff>>(endpoint)
      return response.data.data
    },
    // Optimistic update
    onMutate: async ({ id, isActive }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: merchantKeys.staff.all })

      // Snapshot previous values for all staff queries
      const previousQueries: Array<{ queryKey: readonly unknown[]; data: unknown }> = []
      
      // Get all staff queries from cache
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (merchantKeys.staff.all.every((key, i) => query.queryKey[i] === key)) {
          previousQueries.push({
            queryKey: query.queryKey,
            data: query.state.data,
          })
        }
      })

      // Optimistically update all staff lists
      queryClient.setQueriesData(
        { queryKey: merchantKeys.staff.all, exact: false },
        (old: any) => {
          if (!old) return old

          // Handle different response shapes
          const staff = old.staff || old.data || old.items || []
          const updatedStaff = staff.map((member: Staff) =>
            member.id === id ? { ...member, isActive } : member
          )

          // Return updated structure
          if (old.staff) {
            return { ...old, staff: updatedStaff }
          }
          if (old.data) {
            return { ...old, data: updatedStaff }
          }
          if (old.items) {
            return { ...old, items: updatedStaff }
          }
          return old
        }
      )

      // Optimistically update specific staff member
      queryClient.setQueryData(merchantKeys.staff.detail(id), (old: Staff | undefined) => {
        if (!old) return old
        return { ...old, isActive }
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
      handleApiError(err, { action: 'toggleStaffStatus', resource: 'staff', staffId: variables.id })
    },
    onSuccess: (_, variables) => {
      const statusText = variables.isActive ? 'activated' : 'deactivated'
      toast.success(`Staff member ${statusText} successfully`)
    },
    onSettled: () => {
      // Refetch to ensure consistency (invalidate all staff queries)
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.all, exact: false })
    },
  })
}

/**
 * Activate Staff Hook
 * 
 * Convenience hook for activating a staff member.
 */
export function useActivateStaff() {
  const toggleStatus = useToggleStaffStatus()
  
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, isActive: true }),
    mutateAsync: (id: string) => toggleStatus.mutateAsync({ id, isActive: true }),
  }
}

/**
 * Deactivate Staff Hook
 * 
 * Convenience hook for deactivating a staff member.
 */
export function useDeactivateStaff() {
  const toggleStatus = useToggleStaffStatus()
  
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, isActive: false }),
    mutateAsync: (id: string) => toggleStatus.mutateAsync({ id, isActive: false }),
  }
}

