'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Deal } from '@/types/deal'
import { getDealDerivedFields } from '@/utils/deal'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'

interface DealCardEnhancedProps {
  deal: Deal
  timeOffset?: number
}

export function DealCardEnhanced({ deal, timeOffset = 0 }: DealCardEnhancedProps) {
  const derived = getDealDerivedFields(deal, timeOffset)

  // Format city name
  const cityName = deal.merchant?.city || ''

  return (
    <Link href={`/customer/deals/${deal.slug || deal.id}`} className='block h-full'>
      <Card className='group h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border hover:border-primary/50 bg-card'>
        {/* Image Section with Countdown & Progress Bar */}
        <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
          {/* Placeholder/First Image */}
          {deal.thumbnailUrl ? (
            <img
              src={deal.thumbnailUrl}
              alt={deal.title}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <span className='text-6xl font-bold text-primary/40'>
                {deal.title.charAt(0) || 'D'}
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />

          {/* Top Left: State Badge */}
          {derived.stateBadge && (
            <div className='absolute left-4 top-4'>
              <Badge 
                variant={derived.stateBadge.variant}
                className={cn(
                  'font-semibold shadow-lg backdrop-blur-sm',
                  derived.stateBadge.className
                )}
              >
                {derived.stateBadge.text}
              </Badge>
            </div>
          )}

          {/* Top Right: Countdown Timer */}
          {derived.isActive && (
            <div className='absolute right-4 top-4'>
              <Badge 
                className={cn(
                  'font-mono font-bold shadow-lg backdrop-blur-sm border-2',
                  derived.countdownColor
                )}
              >
                {derived.timeRemainingFormatted}
              </Badge>
            </div>
          )}

          {/* Progress Bar (if inventory-capped) */}
          {derived.shouldShowProgressBar && deal.maxQuantity && (
            <div className='absolute bottom-4 left-4 right-4'>
              <div className='flex items-center justify-between gap-2 mb-1'>
                <span className='text-xs font-semibold text-white'>
                  {derived.inventoryLeft} left
                </span>
                <span className='text-xs text-white/80'>
                  {deal.soldQuantity}/{deal.maxQuantity} sold
                </span>
              </div>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm'>
                <div
                  className={cn(
                    'h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500',
                    derived.hasLowInventory && 'animate-pulse-slow'
                  )}
                  style={{
                    width: `${derived.progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {deal.featured && (
            <div className='absolute right-4 top-4'>
              <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg font-semibold'>
                ⭐ Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className='p-4 space-y-3'>
          {/* Deal Title */}
          <h3 className='line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary'>
            {deal.title}
          </h3>

          {/* Merchant Name + City */}
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span className='font-medium'>{deal.merchant?.businessName || deal.merchant?.name || 'Merchant'}</span>
            {cityName && (
              <>
                <span className='text-muted-foreground/50'>•</span>
                <span>{cityName}</span>
              </>
            )}
          </div>

          {/* Price Row */}
          <div className='space-y-2'>
            {/* You Pay */}
            <div className='flex items-baseline gap-2'>
              <span className='text-xl font-bold text-foreground'>
                {formatCurrency(deal.dealPrice)}
              </span>
              <span className='text-sm text-muted-foreground line-through'>
                {formatCurrency(deal.discountPrice)}
              </span>
            </div>

            {/* Save Badge */}
            <Badge 
              variant='secondary' 
              className='text-xs font-medium'
            >
              Save {derived.savingsPercentage}%
            </Badge>
          </div>

          {/* Social Proof / Low Inventory Warning */}
          {derived.hasLowInventory && derived.inventoryLeft !== null && (
            <div className='rounded-md bg-orange-50 dark:bg-orange-950/20 p-2 text-xs font-medium text-orange-700 dark:text-orange-400'>
              ⚠️ Only {derived.inventoryLeft} left!
            </div>
          )}

          {derived.boughtToday && !derived.hasLowInventory && (
            <div className='text-xs font-medium text-green-600 dark:text-green-400'>
              ✅ {derived.boughtToday}
            </div>
          )}

          {/* Category Badge */}
          {deal.category && (
            <Badge variant='outline' className='text-xs w-fit'>
              {deal.category.icon} {deal.category.name}
            </Badge>
          )}
        </CardContent>

        <CardFooter className='p-4 pt-0'>
          <Button 
            asChild 
            className={cn(
              'w-full font-medium transition-all',
              !derived.isActive && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!derived.isActive}
            variant={derived.isActive ? 'default' : 'secondary'}
          >
            <span>
              {!derived.isActive ? 'Deal Ended' : 'View Deal'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

