'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import api from '@/lib/api'
import type { Order } from '@/types/order'
import type { ApiResponse } from '@/types/common'
import { OrderStatus } from '@/lib/constants'

export interface UpdateOrderStatusDto {
  status: OrderStatus
  paymentReference?: string
}

/**
 * Update Order Status Mutation Hook
 * 
 * Updates order status with optimistic updates for better UX.
 * Note: Order status is usually updated automatically via payment webhooks,
 * but this hook allows manual updates when needed.
 * 
 * @example
 * ```tsx
 * const updateStatus = useUpdateOrderStatus()
 * 
 * updateStatus.mutate({
 *   id: 'order-123',
 *   status: OrderStatus.PAID,
 *   paymentReference: 'midtrans_ref_123'
 * })
 * ```
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateOrderStatusDto): Promise<Order> => {
      const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data)
      return response.data.data
    },
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: merchantKeys.orders.all })

      // Snapshot previous values for all order queries
      const previousQueries: Array<{ queryKey: readonly unknown[]; data: unknown }> = []
      
      // Get all order queries from cache
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (merchantKeys.orders.all.every((key, i) => query.queryKey[i] === key)) {
          previousQueries.push({
            queryKey: query.queryKey,
            data: query.state.data,
          })
        }
      })

      // Optimistically update all order lists
      queryClient.setQueriesData(
        { queryKey: merchantKeys.orders.all, exact: false },
        (old: any) => {
          if (!old) return old

          // Handle different response shapes
          const orders = old.orders || old.data || old.items || []
          const updatedOrders = orders.map((order: Order) =>
            order.id === id ? { ...order, status } : order
          )

          // Return updated structure
          if (old.orders) {
            return { ...old, orders: updatedOrders }
          }
          if (old.data) {
            return { ...old, data: updatedOrders }
          }
          if (old.items) {
            return { ...old, items: updatedOrders }
          }
          return old
        }
      )

      // Optimistically update specific order
      queryClient.setQueryData(merchantKeys.orders.detail(id), (old: Order | undefined) => {
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
      handleApiError(err, { action: 'updateOrderStatus', resource: 'order', orderId: variables.id })
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status.toLowerCase().replace('_', ' ')
      toast.success(`Order status updated to ${statusText}`)
    },
    onSettled: () => {
      // Refetch to ensure consistency (invalidate all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.orders.all, exact: false })
      // Invalidate order stats (status distribution might change)
      queryClient.invalidateQueries({ queryKey: merchantKeys.orders.stats() })
      // Invalidate overview (today's orders might change)
      queryClient.invalidateQueries({ queryKey: merchantKeys.overview.all, exact: false })
    },
  })
}

