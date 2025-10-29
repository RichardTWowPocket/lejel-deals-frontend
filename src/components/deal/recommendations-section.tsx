'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import api from '@/lib/api'
import { Deal } from '@/types/deal'
import { ApiResponse } from '@/types/common'

interface DealWithSales extends Deal {
  soldQuantity: number
  maxQuantity?: number
  image?: string
}

interface DealListResponse {
  deals: DealWithSales[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function RecommendationsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['deals', 'recommended'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DealListResponse>>(
        '/deals?status=ACTIVE&limit=6&sortBy=soldQuantity&sortOrder=desc'
      )
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Rekomendasi Untuk Anda</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!data?.deals || data.deals.length === 0) {
    return null
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="text-gradient-primary">Rekomendasi</span> Untuk Anda
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-elegant-lg"
            >
              {/* Deal Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {(deal.images?.[0] || deal.thumbnailUrl) ? (
                  <img
                    src={deal.images?.[0] || deal.thumbnailUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <span className="text-4xl">🎯</span>
                  </div>
                )}
                {/* Sold Badge */}
                {deal.soldQuantity > 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {deal.soldQuantity} Terjual
                  </div>
                )}
              </div>

              {/* Deal Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {deal.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {deal.description}
                </p>

                {/* Price and Expiry */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary">
                      Rp {deal.discountedPrice?.toLocaleString('id-ID')}
                    </div>
                    {deal.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        Rp {deal.originalPrice?.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link
            href="/deals"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-elegant-lg transition-all duration-300 hover:scale-105"
          >
            Lihat Semua Promo
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

