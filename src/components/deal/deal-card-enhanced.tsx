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
      <Card className='group h-full overflow-hidden transition-all duration-500 hover:shadow-elegant-xl border-border/50 bg-card/50 backdrop-blur-sm'>
        {/* Image Section with Countdown & Progress Bar */}
        <div className='relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20'>
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
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

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

        <CardContent className='p-5'>
          {/* Deal Title */}
          <h3 className='mb-2 line-clamp-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary'>
            {deal.title}
          </h3>

          {/* Merchant Name + City */}
          <div className='mb-3 flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='font-semibold'>{deal.merchant?.businessName || 'Merchant'}</span>
            {cityName && (
              <>
                <span className='text-muted-foreground/50'>•</span>
                <span>{cityName}</span>
              </>
            )}
          </div>

          {/* Price Row */}
          <div className='mb-3 space-y-1'>
            {/* You Pay */}
            <div className='flex items-baseline gap-2'>
              <span className='text-xs text-muted-foreground'>You pay:</span>
              <span className='text-2xl font-bold text-gradient-primary'>
                {formatCurrency(deal.dealPrice)}
              </span>
            </div>

            {/* You Get */}
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>You get:</span>
              <span className='text-sm font-semibold text-muted-foreground line-through'>
                {formatCurrency(deal.discountPrice)}
              </span>
            </div>

            {/* Save Badge */}
            <div className='flex items-center gap-2'>
              <Badge 
                variant='outline' 
                className='border-green-500 text-green-600 dark:text-green-400'
              >
                Save {formatCurrency(derived.savingsAmount)} ({derived.savingsPercentage}%)
              </Badge>
            </div>
          </div>

          {/* Social Proof / Low Inventory Warning */}
          {derived.hasLowInventory && derived.inventoryLeft !== null && (
            <div className='mb-2 rounded-lg bg-orange-500/10 p-2 text-sm font-semibold text-orange-600 dark:text-orange-400'>
              ⚠️ Hampir habis! Tersisa {derived.inventoryLeft} kupon
            </div>
          )}

          {derived.boughtToday && !derived.hasLowInventory && (
            <div className='mb-2 text-sm font-medium text-green-600 dark:text-green-400'>
              ✅ {derived.boughtToday}
            </div>
          )}

          {/* Category Badge */}
          {deal.category && (
            <div className='mt-3'>
              <Badge variant='outline' className='text-xs'>
                {deal.category.icon} {deal.category.name}
              </Badge>
            </div>
          )}
        </CardContent>

        <CardFooter className='p-5 pt-0'>
          <Button 
            asChild 
            className={cn(
              'w-full h-11 text-base font-semibold shadow-elegant-lg transition-all duration-300',
              !derived.isActive && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!derived.isActive}
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

