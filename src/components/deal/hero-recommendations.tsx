'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'
import { Deal } from '@/types/deal'
import { ApiResponse } from '@/types/common'
import { formatCurrency } from '@/utils/format'
import { DealCountdown } from './deal-countdown'

interface DealWithSales extends Omit<Deal, 'discountPercentage'> {
  soldQuantity: number
  maxQuantity?: number
  discountPercentage?: number
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

export function HeroRecommendations() {
  const { data, isLoading } = useQuery({
    queryKey: ['deals', 'hero-recommended'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DealListResponse>>(
        '/deals?status=ACTIVE&limit=3&sortBy=soldQuantity&sortOrder=desc'
      )
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 px-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-start">Rekomendasi Terbaik</h3>
            <p className="text-white/80 text-xs sm:text-sm text-start">Promo terpilih untuk Anda!</p>
          </div>
          <div className="h-8 w-20 sm:w-24 bg-white/20 rounded animate-pulse" />
        </div>
        {/* Mobile Carousel / Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 sm:pb-0">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[66vw] sm:w-auto h-80 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data?.deals || data.deals.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 px-4">
        <div>
          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white text-start">Rekomendasi Terbaik</h3>
          <p className="text-white/80 text-xs sm:text-sm text-start">Promo terpilih untuk Anda</p>
        </div>
        <Button variant="ghost" asChild className="text-white bg-primary hover:text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10">
          <Link href="/deals">
            Lihat semua
          </Link>
        </Button>
      </div>

      {/* Mobile Carousel / Desktop Grid */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 sm:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {data.deals.map((deal) => (
          <div
            key={deal.id}
            className='flex-shrink-0 w-[66vw] sm:w-auto group overflow-hidden rounded-xl transition-all duration-500 hover:shadow-elegant-xl border border-border/50 bg-card/50 backdrop-blur-sm'
          >
            {/* Image Section */}
            <Link href={`/deals/${deal.slug || deal.id}`} className='relative block aspect-[4/3] overflow-hidden'>
              <div className='flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 transition-all duration-500 group-hover:from-primary/30 group-hover:via-secondary/30 group-hover:to-accent/30'>
                <div className='text-center'>
                  <span className='text-4xl sm:text-5xl md:text-6xl font-bold text-primary/40'>
                    {deal.title?.charAt(0) || 'D'}
                  </span>
                  <p className='mt-2 text-xs sm:text-sm font-semibold text-muted-foreground/60'>
                    {deal.category?.name || 'Deal'}
                  </p>
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </Link>

            {/* Content */}
            <div className='p-4 sm:p-5 md:p-6'>

              {/* Deal Title */}
              <Link href={`/deals/${deal.slug || deal.id}`}>
                <h3 className='text-start mb-2 sm:mb-3 line-clamp-2 text-base sm:text-md md:text-lg font-bold transition-colors hover:text-primary leading-tight'>
                  {deal.title || 'Untitled Deal'}
                </h3>
              </Link>

              {/* Price Section */}
              <div className='mb-3 sm:mb-4 text-start'>
                <div className='flex items-baseline gap-1 flex-wrap'>
                  {/* Original Price (Strikethrough) */}
                  {deal.originalPrice && (
                    <span className='text-sm sm:text-sm md:text-lg text-muted-foreground line-through'>
                      {formatCurrency(deal.originalPrice)}
                    </span>
                  )}
                  {/* Deal Price */}
                  <span className='text-xl sm:text-xl md:text-3xl font-bold text-gradient-primary'>
                    {formatCurrency(deal.dealPrice)}
                  </span>
                </div>
              </div>

              {/* Countdown Timer */}
              {deal.validUntil && (
                <div className='flex flex-col items-end'>
                  <div className='text-xs sm:text-sm text-muted-foreground mb-1'>Berakhir pada:</div>
                  <DealCountdown endDate={deal.validUntil} compact />
                </div>
              )}

              {/* Stock Info */}
              {deal.quantityAvailable && deal.quantityAvailable < 10 && deal.quantityAvailable > 0 && (
                <div className='mb-3 sm:mb-4'>
                  <p className='mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-destructive'>
                    ⚠️ Only {deal.quantityAvailable} left!
                  </p>
                  {deal.quantity && (
                    <div className='h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner'>
                      <div
                        className='h-full bg-gradient-to-r from-destructive to-orange-500 transition-all duration-500 shadow-elegant'
                        style={{
                          width: `${(deal.quantityAvailable / deal.quantity) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
