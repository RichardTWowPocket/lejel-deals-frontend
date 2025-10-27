export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface Coupon {
  id: string
  orderId: string
  dealId: string
  qrCode: string
  status: CouponStatus
  usedAt: string | null
  expiresAt: string
  createdAt: string
  updatedAt: string
  // Relations
  deal?: {
    id: string
    title: string
    discountPrice: number
    images: string[]
    validUntil: string
    status: string
    merchant: {
      id: string
      businessName: string
      logoUrl?: string
    }
  }
  order?: {
    id: string
    orderNumber: string
    totalAmount: number
  }
}

export interface CouponFilters {
  status?: CouponStatus
  dealId?: string
  orderId?: string
  page?: number
  limit?: number
}

export interface CouponListResponse {
  coupons: Coupon[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}




