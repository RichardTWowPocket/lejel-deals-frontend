export enum DealStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  SOLD_OUT = 'SOLD_OUT',
}

export enum DealType {
  DISCOUNT = 'discount',
  VOUCHER = 'voucher',
  CASHBACK = 'cashback',
  BUNDLE = 'bundle',
}

export interface Deal {
  id: string
  slug: string
  title: string
  description: string
  shortDescription?: string
  images: string[]
  thumbnailUrl: string
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  merchantId: string
  merchant: {
    id: string
    businessName: string
    slug: string
    logoUrl?: string
    address?: string
  }
  type: DealType
  dealPrice: number // Price customer pays
  discountPrice: number // Voucher face value
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  quantity: number
  quantityAvailable: number
  validFrom: string
  validUntil: string
  redemptionDeadline: string
  status: DealStatus
  terms: string
  highlights?: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    orders: number
  }
}

export interface DealFilters {
  categoryId?: string
  merchantId?: string
  minPrice?: number
  maxPrice?: number
  type?: DealType
  status?: DealStatus
  search?: string
  featured?: boolean
  sortBy?: 'createdAt' | 'discountedPrice' | 'discountPercentage' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface DealListResponse {
  deals: Deal[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

