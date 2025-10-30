'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Share2, Heart, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { useDeal } from '@/hooks/use-deals'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DealCountdown } from '@/components/deal/deal-countdown'
import { formatCurrency, formatDiscount } from '@/utils/format'
import { formatDate } from '@/utils/date'
import { useAuth } from '@/hooks/use-auth'
import toast from 'react-hot-toast'

export default function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: deal, isLoading, error } = useDeal(slug)
  const { isAuthenticated } = useAuth()

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this deal')
      return
    }
    // TODO: Navigate to checkout
    toast.success('Redirecting to checkout...')
  }

  const handleShare = async () => {
    if (navigator.share && deal) {
      try {
        await navigator.share({
          title: deal.title,
          text: deal.shortDescription || deal.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <Skeleton className='mb-4 h-10 w-32' />
          <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <Skeleton className='mb-4 aspect-video w-full' />
              <Skeleton className='mb-2 h-8 w-3/4' />
              <Skeleton className='h-24 w-full' />
            </div>
            <Skeleton className='h-96' />
          </div>
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card className='p-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold'>Deal not found</h2>
          <p className='mb-4 text-muted-foreground'>The deal you&apos;re looking for doesn&apos;t exist</p>
          <Button asChild>
            <Link href='/deals'>Browse All Deals</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const savings = deal.discountPrice - deal.dealPrice // Voucher value minus what customer pays

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      {/* Back Button */}
      <div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' asChild className='gap-2'>
            <Link href='/deals'>
              <ArrowLeft className='h-4 w-4' />
              Back to Deals
            </Link>
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Image Gallery */}
            <div className='mb-6 overflow-hidden rounded-xl bg-muted'>
              <div className='relative aspect-video w-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20'>
                <div className='text-center'>
                  <span className='text-8xl font-bold text-primary/40'>
                    {deal.title?.charAt(0) || 'D'}
                  </span>
                  <p className='mt-4 text-xl font-semibold text-muted-foreground/60'>
                    {deal.category?.name || 'Deal'}
                  </p>
                </div>
                {deal.featured && (
                  <div className='absolute left-4 top-4'>
                    <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'>
                      ⭐ Featured Deal
                    </Badge>
                  </div>
                )}
                <div className='absolute right-4 top-4 flex gap-2'>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='rounded-full shadow-lg'
                    onClick={handleShare}
                  >
                    <Share2 className='h-4 w-4' />
                  </Button>
                  <Button size='icon' variant='secondary' className='rounded-full shadow-lg'>
                    <Heart className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            {/* Deal Info */}
            <Card className='mb-6'>
              <CardContent className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex-1'>
                    <Badge variant='outline' className='mb-2'>
                      {deal.category.name}
                    </Badge>
                    <h1 className='mb-2 text-3xl font-bold tracking-tight'>{deal.title}</h1>
                    <Link href={`/merchants/${deal.merchant.slug}`}>
                      <div className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'>
                        <div className='flex h-6 w-6 items-center justify-center rounded bg-gradient-primary text-white text-xs font-bold'>
                          {deal.merchant.businessName?.charAt(0) || 'M'}
                        </div>
                        <span className='font-medium'>{deal.merchant.businessName}</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {deal.merchant.address && (
                  <div className='mb-4 flex items-start gap-2 text-sm text-muted-foreground'>
                    <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' />
                    <span>{deal.merchant.address}</span>
                  </div>
                )}

                <div className='mb-6 rounded-lg border bg-muted/50 p-4'>
                  <DealCountdown endDate={deal.validUntil} />
                </div>

                {/* Description */}
                <div className='mb-6'>
                  <h2 className='mb-3 text-xl font-semibold'>About This Deal</h2>
                  <p className='leading-relaxed text-muted-foreground'>{deal.description}</p>
                </div>

                {/* Highlights */}
                {deal.highlights && deal.highlights.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='mb-3 text-xl font-semibold'>Highlights</h2>
                    <ul className='space-y-2'>
                      {deal.highlights.map((highlight, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                          <span className='text-muted-foreground'>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div>
                  <h2 className='mb-3 text-xl font-semibold'>Terms & Conditions</h2>
                  <div className='rounded-lg bg-muted/50 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
                      {deal.terms}
                    </p>
                  </div>
                  <div className='mt-3 flex items-center gap-2 text-sm text-muted-foreground'>
                    <Clock className='h-4 w-4' />
                    <span>
                      Valid from {formatDate(deal.validFrom)} until {formatDate(deal.validUntil)}
                    </span>
                  </div>
                  <div className='mt-2 text-sm text-muted-foreground'>
                    <span>Redemption deadline: {formatDate(deal.redemptionDeadline)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className='lg:sticky lg:top-24 lg:self-start'>
            <Card className='shadow-xl'>
              <CardContent className='p-6'>
                {/* Price Section */}
                <div className='mb-6'>
                  <div className='mb-1 text-sm font-medium text-muted-foreground'>
                    Price You Pay
                  </div>
                  <div className='mb-2 flex items-baseline gap-2'>
                    <span className='text-4xl font-bold text-primary'>
                      {formatCurrency(deal.dealPrice)}
                    </span>
                    <Badge variant='destructive' className='text-base font-bold'>
                      {formatDiscount(deal.discountPercentage)} OFF
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-muted/50 p-3'>
                    <div className='mb-1 text-sm text-muted-foreground'>
                      Voucher Value
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-xl font-bold text-foreground'>
                        {formatCurrency(deal.discountPrice)}
                      </span>
                      <span className='text-sm font-medium text-green-600'>
                        You Save {formatCurrency(savings)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Info */}
                <div className='mb-6 rounded-lg bg-muted/50 p-4'>
                  <div className='mb-2 flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Availability</span>
                    <span className='font-medium'>
                      {deal.quantityAvailable} / {deal.quantity} available
                    </span>
                  </div>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full bg-gradient-to-r from-green-500 to-primary transition-all duration-300'
                      style={{
                        width: `${(deal.quantityAvailable / deal.quantity) * 100}%`,
                      }}
                    />
                  </div>
                  {deal.quantityAvailable < 10 && (
                    <p className='mt-2 text-sm font-medium text-destructive'>
                      ⚠️ Only {deal.quantityAvailable} left! Hurry up!
                    </p>
                  )}
                </div>

                {/* Purchase Button */}
                <Button
                  size='lg'
                  className='mb-4 w-full text-base'
                  onClick={handlePurchase}
                  disabled={deal.quantityAvailable === 0}
                >
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  {deal.quantityAvailable > 0 ? 'Buy Now' : 'Sold Out'}
                </Button>

                {/* Trust Badges */}
                <div className='space-y-2 border-t pt-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span>Instant digital coupon delivery</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span>Secure payment via Midtrans</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className='mt-4'>
              <CardContent className='p-4'>
                <p className='mb-3 text-sm font-medium'>Share this deal</p>
                <Button variant='outline' className='w-full' onClick={handleShare}>
                  <Share2 className='mr-2 h-4 w-4' />
                  Share Deal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

