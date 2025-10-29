'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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
    ordersDetails: any[]
    redemptionsDetails: any[]
  }
  activeDeals: number
  activeDealsList: any[]
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

export function useMerchantOverview(merchantId?: string) {
  return useQuery({
    queryKey: ['merchantOverview', merchantId],
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required')
      const { data } = await axios.get<MerchantOverview>(
        `${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}/overview`,
        { withCredentials: true }
      )
      return data
    },
    enabled: !!merchantId,
  })
}

export function useMerchantPayouts(merchantId?: string, period: 'day' | 'week' | 'month' | 'year' | 'all' = 'all') {
  return useQuery({
    queryKey: ['merchantPayouts', merchantId, period],
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required')
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}/payouts?period=${period}`,
        { withCredentials: true }
      )
      return data
    },
    enabled: !!merchantId,
  })
}

export function useMerchantDeals(merchantId?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['merchantDeals', merchantId, page, limit],
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required')
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/deals?merchantId=${merchantId}&page=${page}&limit=${limit}`,
        { withCredentials: true }
      )
      return data
    },
    enabled: !!merchantId,
  })
}



