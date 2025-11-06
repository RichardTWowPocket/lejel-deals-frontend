'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import { useMerchant as useMerchantContext } from '@/lib/merchant-context'
import { merchantKeys } from '@/lib/query-keys'

export interface MerchantOverview {
  merchant: {
    id: string
    name: string
    email: string
  }
  today: {
    orders: number
    redemptions: number
    revenue: number
    voucherValueRedeemed: number
    ordersDetails: Array<{
      id: string
      orderNumber: string
      totalAmount: number | string
      customer?: { firstName?: string; lastName?: string }
    }>
    redemptionsDetails: Array<{
      id: string
      coupon: {
        deal: { title: string }
        order: { orderNumber: string }
      }
    }>
  }
  activeDeals: number
  activeDealsList: Array<{ id: string; title: string }>
  lowInventoryDeals: Array<{
    id: string
    title: string
    remaining: number
    total: number
    percentageLeft: number
  }>
  expiringSoonDeals: Array<{
    id: string
    title: string
    expiresAt: string
  }>
  redemptionRate: number
  alerts: {
    lowInventory: number
    expiringSoon: number
    hasAlerts: boolean
  }
}

export function useMerchantOverview() {
  const { activeMerchantId } = useMerchantContext()
  
  return useQuery({
    queryKey: merchantKeys.overview.me(activeMerchantId),
    queryFn: async () => {
      // Use apiClient which automatically adds Authorization header via interceptor
      const url = activeMerchantId
        ? `/merchants/me/overview?merchantId=${activeMerchantId}`
        : `/merchants/me/overview`
      
      return apiClient.get<MerchantOverview>(url)
    },
    staleTime: 30 * 1000, // 30 seconds (real-time dashboard data)
    gcTime: 2 * 60 * 1000, // 2 minutes (garbage collection)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

// Note: useMerchantPayouts has been moved to hooks/merchant/use-merchant-payouts.ts
// This export is kept for backwards compatibility but should be removed
// Use: import { useMerchantPayouts } from '@/hooks/merchant'

export function useMerchantDeals(merchantId?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: merchantKeys.deals.list(merchantId, page, limit),
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required')
      // Use apiClient which automatically adds Authorization header via interceptor
      return apiClient.get(
        `/deals?merchantId=${merchantId}&page=${page}&limit=${limit}`
      )
    },
    enabled: !!merchantId,
  })
}




