export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  color?: string
  imageUrl?: string
  parentId?: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
  _count?: {
    deals: number
  }
}

export interface CategoryWithDeals extends Category {
  deals: Array<{
    id: string
    title: string
    slug: string
    thumbnailUrl: string
    originalPrice: number
    discountedPrice: number
    discountPercentage: number
  }>
}

