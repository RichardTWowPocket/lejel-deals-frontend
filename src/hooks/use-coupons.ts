import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { formatCouponsWithPagination, formatPaginated } from '@/lib/responseFormatter'
import { ENDPOINTS } from '@/lib/endpoints'
import { CouponStatus } from '@/types/coupon'
import { customerKeys } from '@/lib/query-keys'

interface CouponsResponse {
  coupons: any[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export function useCouponsByOrder(orderId?: string) {
  return useQuery({
    enabled: !!orderId,
    queryKey: customerKeys.coupons.byOrder(orderId!),
    queryFn: async () => {
      const res = await api.get<any[]>(ENDPOINTS.coupons.byOrder(orderId!))
      return res.data
    },
  })
}

export function useMyCoupons(page: number = 1, limit: number = 10, status?: CouponStatus) {
  return useQuery({
    queryKey: customerKeys.coupons.list(page, limit, status),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (status) {
        params.append('status', status)
      }
      const res = await api.get<any>(`${ENDPOINTS.coupons.me}?${params.toString()}`)
      console.log('[useMyCoupons] Response', formatCouponsWithPagination(res.data))
      return formatCouponsWithPagination(res.data)
    },
  })
}

export function useActiveCoupons(limit: number = 10) {
  return useQuery({
    queryKey: customerKeys.coupons.active(limit),
    queryFn: async () => {
      const res = await api.get<any>(`${ENDPOINTS.coupons.me}?status=ACTIVE&limit=${limit}`)
      return formatCouponsWithPagination(res.data)
    },
  })
}


