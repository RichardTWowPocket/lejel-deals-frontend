export interface Merchant {
  id: string
  slug: string
  businessName: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  phone: string
  email?: string
  website?: string
  address: string
  city: string
  province: string
  postalCode: string
  latitude?: number
  longitude?: number
  openingHours?: OpeningHours
  verified: boolean
  featured: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
  _count?: {
    deals: number
    orders: number
  }
}

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface MerchantFilters {
  search?: string
  city?: string
  verified?: boolean
  featured?: boolean
  sortBy?: 'businessName' | 'createdAt' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface MerchantListResponse {
  merchants: Merchant[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

