import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, CheckCircle2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Merchant } from '@/types/merchant'

interface MerchantCardProps {
  merchant: Merchant
}

export function MerchantCard({ merchant }: MerchantCardProps) {
  return (
    <Card className='group overflow-hidden transition-all duration-500 hover:shadow-elegant-xl border-border/50 bg-card/50 backdrop-blur-sm'>
      {/* Banner/Logo Section */}
      <div className='relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10'>
        {merchant.bannerUrl ? (
          <Image
            src={merchant.bannerUrl}
            alt={merchant.businessName}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-110'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <span className='text-7xl font-bold text-muted-foreground/20'>
              {merchant.businessName.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Logo Overlay */}
        <div className='absolute bottom-6 left-6'>
          <div className='relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-white shadow-elegant-xl group-hover:scale-105 transition-transform duration-300'>
            {merchant.logoUrl ? (
              <Image src={merchant.logoUrl} alt={merchant.businessName} fill className='object-cover' />
            ) : (
              <div className='flex h-full items-center justify-center bg-gradient-primary'>
                <span className='text-3xl font-bold text-white'>
                  {merchant.businessName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verified Badge */}
        {merchant.verified && (
          <div className='absolute right-6 top-6'>
            <Badge className='flex items-center gap-2 bg-white text-green-600 shadow-elegant-lg font-semibold px-3 py-2'>
              <CheckCircle2 className='h-4 w-4' />
              Verified
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {merchant.featured && (
          <div className='absolute left-6 top-6'>
            <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-elegant-lg font-semibold px-3 py-2'>
              ⭐ Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className='p-8'>
        {/* Business Name */}
        <Link href={`/merchants/${merchant.slug}`}>
          <h3 className='mb-3 line-clamp-1 text-2xl font-bold transition-colors hover:text-gradient-primary leading-tight'>
            {merchant.businessName}
          </h3>
        </Link>

        {/* Rating */}
        {merchant.rating && (
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                <span className='text-lg font-bold'>{merchant.rating.toFixed(1)}</span>
              </div>
              {merchant.reviewCount && (
                <span className='text-sm text-muted-foreground'>({merchant.reviewCount} reviews)</span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {merchant.description && (
          <p className='mb-5 line-clamp-2 text-muted-foreground leading-relaxed'>{merchant.description}</p>
        )}

        {/* Location */}
        <div className='mb-5 flex items-start gap-3 text-muted-foreground'>
          <MapPin className='mt-1 h-5 w-5 flex-shrink-0 text-primary' />
          <span className='line-clamp-2 text-sm'>{merchant.address}, {merchant.city}</span>
        </div>

        {/* Stats */}
        <div className='mb-6 flex gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
              <TrendingUp className='h-4 w-4 text-primary' />
            </div>
            <div>
              <span className='text-lg font-bold text-gradient-primary'>{merchant._count?.deals || 0}</span>
              <span className='ml-1 text-muted-foreground'>deals</span>
            </div>
          </div>
          {merchant._count?.orders && merchant._count.orders > 0 && (
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10'>
                <span className='text-sm font-bold text-secondary'>📦</span>
              </div>
              <div>
                <span className='text-lg font-bold text-gradient-secondary'>{merchant._count.orders}+</span>
                <span className='ml-1 text-muted-foreground'>orders</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button asChild variant='outline' className='w-full h-12 text-lg font-semibold border-2 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'>
          <Link href={`/merchants/${merchant.slug}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

