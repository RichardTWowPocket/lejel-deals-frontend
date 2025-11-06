/**
 * Order Types
 * 
 * Types for merchant order management
 */

import { OrderStatus } from '@/lib/constants'
import { Deal } from './deal'
import { Customer } from './common'
import { Coupon } from './coupon'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  dealId: string
  deal?: Deal
  quantity: number
  totalAmount: number
  status: OrderStatus
  paymentMethod?: string
  paymentReference?: string
  coupons?: Coupon[]
  createdAt: string
  updatedAt: string
}

export interface OrderListResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface OrderFilters {
  page?: number
  limit?: number
  merchantId?: string
  status?: OrderStatus
  customerId?: string
  dealId?: string
  startDate?: string
  endDate?: string
  search?: string // For customer name/email or order number search
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  paidOrders: number
  cancelledOrders: number
  refundedOrders: number
  totalRevenue: number
  averageOrderValue: number
  statusDistribution: {
    [key in OrderStatus]: number
  }
}

export interface OrderTimelineEvent {
  id: string
  type: 'order_placed' | 'payment_pending' | 'payment_confirmed' | 'coupons_generated' | 'coupon_used' | 'refund_requested' | 'refund_processed' | 'order_cancelled'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  metadata?: {
    amount?: number
    paymentMethod?: string
    couponCount?: number
    staffName?: string
    location?: string
  }
}



