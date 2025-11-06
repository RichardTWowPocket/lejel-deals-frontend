'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { OrderListResponse, OrderFilters } from '@/types/order'
import { ApiResponse, Order } from '@/types/common'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'

export function useMerchantOrders(filters?: OrderFilters) {
  const { activeMerchantId } = useMerchant()

  return useQuery<OrderListResponse, Error>({
    queryKey: merchantKeys.orders.list({ ...filters, merchantId: activeMerchantId ?? undefined }),
    queryFn: async () => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const params = new URLSearchParams()
      
      // Add merchant ID
      params.append('merchantId', activeMerchantId)
      
      // Add other filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'startDate' || key === 'endDate') {
              // Format dates as ISO strings
              params.append(key, new Date(value).toISOString())
            } else if (key !== 'merchantId' && key !== 'search') {
              // Exclude search from API params (we'll handle it client-side or backend needs to support it)
              params.append(key, String(value))
            }
          }
        })
      }

      // Default pagination if not provided
      if (!filters?.page) params.append('page', '1')
      if (!filters?.limit) params.append('limit', '10')

      const response = await api.get<ApiResponse<OrderListResponse>>(
        `/orders?${params.toString()}`
      )
      return response.data.data
    },
    enabled: !!activeMerchantId,
    staleTime: 2 * 60 * 1000, // 2 minutes - data is considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Respect global setting - don't refetch on window focus
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnReconnect: true, // Still refetch on reconnect
  })
}

export function useMerchantOrder(orderId: string | undefined) {
  const { activeMerchantId } = useMerchant()

  return useQuery<Order, Error>({
    queryKey: merchantKeys.orders.detail(orderId || ''),
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Order ID is required')
      }
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`)
      
      // Verify the order belongs to the active merchant
      if (response.data.data.deal?.merchantId !== activeMerchantId) {
        throw new Error('Order not found or not accessible for this merchant.')
      }
      
      return response.data.data
    },
    enabled: !!orderId && !!activeMerchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes (less frequently changing details)
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  })
}



