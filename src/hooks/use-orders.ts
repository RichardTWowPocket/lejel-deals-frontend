import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { formatOrdersWithPagination } from '@/lib/responseFormatter'
import { ENDPOINTS } from '@/lib/endpoints'

interface OrdersResponse {
  data: any[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export function useCustomerOrders(_customerId?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    enabled: true,
    queryKey: ['orders', 'me', page, limit],
    queryFn: async () => {
      const res = await api.get<OrdersResponse>(`${ENDPOINTS.orders.me}?page=${page}&limit=${limit}`)
      console.log('[useCustomerOrders] Response', res.data)
      return formatOrdersWithPagination(res)
    },
  })
}


