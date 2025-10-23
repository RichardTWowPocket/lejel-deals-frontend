'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActiveCoupons } from '@/hooks/use-coupons'
import { useFeaturedDeals } from '@/hooks/use-deals'
import { CouponHeroStrip } from '@/components/coupon/coupon-hero-strip'
import { ActiveCouponsCarousel } from '@/components/coupon/active-coupons-carousel'
import { EmptyCouponsState } from '@/components/customer/empty-coupons-state'
import { NotificationsPreview } from '@/components/customer/notifications-preview'
import { DealCard } from '@/components/deal/deal-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, ShoppingBag, Ticket, QrCode, ArrowRight } from 'lucide-react'

export default function CustomerDashboardPage() {
  // Fetch active coupons
  const { data: couponsData, isLoading: couponsLoading } = useActiveCoupons(10)
  console.log('[CustomerDashboardPage] Coupons Data', couponsData)
  
  // Fetch recommended deals (featured for now)
  const { data: dealsData, isLoading: dealsLoading } = useFeaturedDeals(6)

  const activeCoupons = couponsData?.data || []  // ← Changed from coupons to data
  const recommendedDeals = dealsData?.deals || []

  // Find nearest expiring coupon for hero strip
  const nearestExpiringCoupon = activeCoupons
    .filter((c) => c.status === 'ACTIVE')
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0]

  // Stats
  const totalActiveCoupons = couponsData?.pagination?.total || 0

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-8'>
        {/* Header */}
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>Dashboard Saya</h1>
          <p className='text-muted-foreground'>
            Kelola kupon, pantau pesanan, dan temukan penawaran terbaik untuk Anda.
          </p>
        </header>

        {/* Hero Strip - Nearest Expiring Coupon */}
        {!couponsLoading && nearestExpiringCoupon && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <h2 className='text-xl font-semibold'>⚠️ Segera Berakhir</h2>
            </div>
            <CouponHeroStrip coupon={nearestExpiringCoupon} />
          </div>
        )}

        {/* Loading state for hero strip */}
        {couponsLoading && (
          <div className='space-y-3'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-32 w-full' />
          </div>
        )}

        {/* My Active Coupons Carousel */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Kupon Aktif Saya</h2>
              <p className='text-sm text-muted-foreground'>
                {totalActiveCoupons} kupon siap digunakan
              </p>
            </div>
            {activeCoupons.length > 0 && (
              <Button asChild variant='ghost' size='sm'>
                <Link href='/customer/coupons'>
                  Lihat Semua
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            )}
          </div>

          {couponsLoading && (
            <div className='flex gap-4 overflow-x-auto'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-64 min-w-[280px] flex-shrink-0 md:min-w-[320px]' />
              ))}
            </div>
          )}

          {!couponsLoading && activeCoupons.length === 0 && <EmptyCouponsState />}

          {!couponsLoading && activeCoupons.length > 0 && (
            <ActiveCouponsCarousel coupons={activeCoupons} />
          )}
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Card className='border-border/50 bg-card/50 shadow-elegant backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                  <Ticket className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>{totalActiveCoupons}</div>
                  <div className='text-sm text-muted-foreground'>Kupon Aktif</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-border/50 bg-card/50 shadow-elegant backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10'>
                  <ShoppingBag className='h-6 w-6 text-blue-500' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>0</div>
                  <div className='text-sm text-muted-foreground'>Total Pesanan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-border/50 bg-card/50 shadow-elegant backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10'>
                  <QrCode className='h-6 w-6 text-green-500' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>0</div>
                  <div className='text-sm text-muted-foreground'>Telah Ditukar</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout - Recommendations & Notifications */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Recommendations - Takes 2 columns */}
          <div className='space-y-4 lg:col-span-2'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold'>Rekomendasi Untuk Anda</h2>
                <p className='text-sm text-muted-foreground'>
                  Deal pilihan berdasarkan preferensi Anda
                </p>
              </div>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/deals'>
                  Jelajahi Semua
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>

            {dealsLoading && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='h-96' />
                ))}
              </div>
            )}

            {!dealsLoading && recommendedDeals.length > 0 && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {recommendedDeals.slice(0, 4).map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}

            {!dealsLoading && recommendedDeals.length === 0 && (
              <Card className='border-2 border-dashed border-border/50 bg-muted/20'>
                <CardContent className='flex flex-col items-center py-8 text-center'>
                  <Sparkles className='mb-3 h-12 w-12 text-muted-foreground' />
                  <p className='text-muted-foreground'>Belum ada rekomendasi tersedia</p>
                  <Button asChild className='mt-4' size='sm'>
                    <Link href='/deals'>Jelajahi Deal</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notifications Preview - Takes 1 column */}
          <div className='lg:col-span-1'>
            <NotificationsPreview />
          </div>
        </div>

        {/* Primary Actions */}
        <Card className='border-border/50 bg-gradient-to-br from-primary/5 to-primary/10'>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Pintasan untuk fitur yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-3'>
            <Button asChild size='lg'>
              <Link href='/customer/coupons'>
                <Ticket className='mr-2 h-5 w-5' />
                Lihat Kupon
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/deals'>
                <Sparkles className='mr-2 h-5 w-5' />
                Jelajahi Deal
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/customer/orders'>
                <ShoppingBag className='mr-2 h-5 w-5' />
                Riwayat Pesanan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}


