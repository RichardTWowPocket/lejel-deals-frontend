/**
 * Payout Types
 * 
 * Types for merchant payout/revenue management
 */

export type PayoutPeriod = 'day' | 'week' | 'month' | 'year' | 'all'

export interface PayoutSummary {
  period: PayoutPeriod
  startDate: string
  endDate: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topDeals: Array<{
    dealId: string
    dealTitle: string
    orders: number
    revenue: number
  }>
}

export interface DailyTrend {
  date: string
  orders: number
  revenue: number
  averageOrderValue: number
}

export interface PayoutResponse {
  merchant: {
    id: string
    name: string
  }
  summary: PayoutSummary
  orders: Array<{
    id: string
    orderNumber: string
    totalAmount: number
    status: string
    createdAt: string
    customer?: {
      id: string
      firstName?: string
      lastName?: string
      email?: string
    }
    deal?: {
      id: string
      title: string
    }
  }>
  dailyTrends: DailyTrend[]
  totalRecords: number
}

export interface PayoutStats {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueGrowth?: number
  ordersGrowth?: number
}



