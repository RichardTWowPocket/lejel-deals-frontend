/**
 * Redemption Types
 * 
 * Types for QR code validation and redemption flow
 */

export interface QRValidationResponse {
  isValid: boolean
  error?: string
  payload?: {
    couponId: string
    orderId: string
    dealId: string
    customerId: string
    merchantId: string
    expiresAt: string
    issuedAt: string
    nonce: string
  }
  coupon?: {
    id: string
    orderId: string
    dealId: string
    status: string
    expiresAt: string
    usedAt?: string
  }
  order?: {
    id: string
    orderNumber: string
    customerId: string
    totalAmount: number
    status: string
  }
  deal?: {
    id: string
    title: string
    description: string
    merchantId: string
    discountPrice: number
  }
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  merchant?: {
    id: string
    name: string
    email: string
  }
}

export interface RedemptionResponse {
  id: string
  couponId: string
  redeemedByUserId: string
  notes?: string
  location?: string
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED'
  redeemedAt: string
  createdAt: string
  updatedAt: string
  coupon: {
    id: string
    orderId: string
    dealId: string
    status: string
    expiresAt: string
    usedAt?: string
  }
  order: {
    id: string
    orderNumber: string
    customerId: string
    totalAmount: number
    status: string
  }
  deal: {
    id: string
    title: string
    description: string
    merchantId: string
    discountPrice: number
  }
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  merchant: {
    id: string
    name: string
    email: string
  }
}

export interface ProcessRedemptionDto {
  qrToken: string
  redeemedByUserId: string
  notes?: string
  location?: string
}

export enum RedemptionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface RedemptionListResponse {
  redemptions: RedemptionResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface RedemptionFilters {
  page?: number
  limit?: number
  merchantId?: string
  redeemedByUserId?: string
  status?: RedemptionStatus
  startDate?: string
  endDate?: string
  dealId?: string
  customerId?: string
  search?: string // For customer name/email search
}

export interface RedemptionStats {
  totalRedemptions: number
  completedRedemptions: number
  pendingRedemptions: number
  cancelledRedemptions: number
  completionRate: number
  redemptionsByStaff: Array<{
    userId: string
    userEmail: string
    redemptionCount: number
  }>
  recentRedemptions: number
  averageRedemptionTime?: string
  statusDistribution: {
    completed: number
    pending: number
    cancelled: number
  }
}

