'use client'

import Link from 'next/link'
import { MapPin, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Deal } from '@/types/deal'
import { formatCurrency, formatDiscount } from '@/utils/format'
import { getDaysRemaining } from '@/utils/date'
import { DealCountdown } from './deal-countdown'

interface DealCardProps {
  deal: Deal
  featured?: boolean
}

export function DealCard({ deal, featured = false }: DealCardProps) {
  // Handle incomplete deal data gracefully
  const daysRemaining = deal.validUntil ? getDaysRemaining(deal.validUntil) : 0
  const soldPercentage = deal._count?.orders && deal.quantity
    ? Math.round((deal._count.orders / deal.quantity) * 100)
    : 0

  return (
    <Card className='group overflow-hidden transition-all duration-500 hover:shadow-elegant-xl border-border/50 bg-card/50 backdrop-blur-sm'>
      {/* Image Section */}
      <Link href={`/deals/${deal.slug || '#'}`} className='relative block aspect-[4/3] overflow-hidden'>
        <div className='flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 transition-all duration-500 group-hover:from-primary/30 group-hover:via-secondary/30 group-hover:to-accent/30'>
          <div className='text-center'>
            <span className='text-6xl font-bold text-primary/40'>
              {deal.title?.charAt(0) || 'D'}
            </span>
            <p className='mt-2 text-sm font-semibold text-muted-foreground/60'>
              {deal.category?.name || 'Deal'}
            </p>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        
        {/* Overlay Badges */}
        <div className='absolute left-4 top-4 flex flex-col gap-2'>
          {deal.featured && (
            <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-elegant-lg font-semibold'>
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Urgency Indicator */}
        {daysRemaining > 0 && daysRemaining <= 3 && (
          <div className='absolute right-4 top-4'>
            <Badge variant='warning' className='animate-pulse-slow shadow-elegant-lg font-semibold'>
              🔥 Ending Soon!
            </Badge>
          </div>
        )}

        {/* Popularity Indicator */}
        {soldPercentage >= 70 && (
          <div className='absolute bottom-4 right-4'>
            <Badge variant='success' className='flex items-center gap-1 shadow-elegant-lg font-semibold'>
              <TrendingUp className='h-4 w-4' />
              Hot Deal
            </Badge>
          </div>
        )}
      </Link>

      <CardContent className='p-6'>
        {/* Merchant Info */}
        {deal.merchant && (
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-white font-bold shadow-elegant'>
              {deal.merchant.businessName?.charAt(0) || 'M'}
            </div>
            <span className='text-sm font-semibold text-muted-foreground'>
              {deal.merchant.businessName || 'Merchant'}
            </span>
          </div>
        )}

        {/* Deal Title */}
        <Link href={`/deals/${deal.slug || '#'}`}>
          <h3 className='mb-3 line-clamp-2 text-xl font-bold transition-colors hover:text-primary leading-tight'>
            {deal.title || 'Untitled Deal'}
          </h3>
        </Link>

        {/* Category & Location */}
        <div className='mb-4 flex items-center gap-3 text-sm text-muted-foreground'>
          {deal.category && (
            <Badge variant='outline' className='font-medium px-3 py-1 border-2'>
              {deal.category.name || 'Category'}
            </Badge>
          )}
          {deal.merchant?.address && (
            <div className='flex items-center gap-1'>
              <MapPin className='h-4 w-4' />
              <span className='line-clamp-1'>{deal.merchant.address.split(',')[0]}</span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className='mb-4'>
          {/* Deal Price (What Customer Pays) */}
          <div className='mb-2'>
            <span className='text-3xl font-bold text-gradient-primary'>
              {formatCurrency(deal.dealPrice)}
            </span>
          </div>
          {/* Discount Price (Voucher Value) */}
          <div className='text-sm text-muted-foreground'>
            Voucher Value: <span className='font-semibold'>{formatCurrency(deal.discountPrice)}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        {deal.validUntil && (
          <div className='mb-4'>
            <DealCountdown endDate={deal.validUntil} compact />
          </div>
        )}

        {/* Stock Info */}
        {deal.quantityAvailable && deal.quantityAvailable < 10 && deal.quantityAvailable > 0 && (
          <div className='mb-4'>
            <p className='mb-2 text-sm font-semibold text-destructive'>
              ⚠️ Only {deal.quantityAvailable} left!
            </p>
            {deal.quantity && (
              <div className='h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner'>
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
      </CardContent>

      <CardFooter className='p-6 pt-0'>
        <Button asChild className='w-full h-12 text-lg font-semibold shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'>
          <Link href={`/deals/${deal.slug || '#'}`}>View Deal</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

