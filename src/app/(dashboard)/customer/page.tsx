'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActiveCoupons } from '@/hooks/use-coupons'
import { useFeaturedDeals } from '@/hooks/use-deals'
import { useCustomerOrders } from '@/hooks/use-orders'
import { CouponHeroStrip } from '@/components/coupon/coupon-hero-strip'
import { ActiveCouponsCarousel } from '@/components/coupon/active-coupons-carousel'
import { EmptyCouponsState } from '@/components/customer/empty-coupons-state'
import { NotificationsPreview } from '@/components/customer/notifications-preview'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderStatusBadge } from '@/components/ui/order-status-badge'
import { 
  Sparkles, 
  ShoppingBag, 
  Ticket, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Plus
} from 'lucide-react'

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  
  // Fetch active coupons
  const { data: couponsData, isLoading: couponsLoading } = useActiveCoupons(10)
  
  // Fetch recommended deals (featured for now)
  const { data: dealsData, isLoading: dealsLoading } = useFeaturedDeals(6)
  
  // Fetch customer orders
  const { data: ordersData, isLoading: ordersLoading } = useCustomerOrders()

  const activeCoupons = couponsData?.data || []
  const recommendedDeals = dealsData?.deals || []
  const orders = ordersData?.data || []

  // Find nearest expiring coupon for hero strip
  const nearestExpiringCoupon = activeCoupons
    .filter((c) => c.status === 'ACTIVE')
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0]

  const isExpiringSoon = (() => {
    if (!nearestExpiringCoupon?.expiresAt) return false
    const now = new Date()
    const expiry = new Date(nearestExpiringCoupon.expiresAt)
    const diffInDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 3
  })()

  // Calculate stats
  const totalActiveCoupons = couponsData?.pagination?.total || 0
  const totalOrders = ordersData?.pagination?.total || 0
  const totalRedeemed = activeCoupons.filter(c => c.status === 'USED').length
  const totalSavings = orders.reduce((sum, order) => sum + (order.deal?.discountPrice || 0), 0)

  // Get current date info
  const today = new Date()
  const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' })
  const dateString = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  
  // Get username (first name if full name, or full name if no space, or fallback)
  const username = user?.name ? (user.name.split(' ')[0] || user.name) : 'User'

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='mx-auto'>
        {/* Header Section */}
        <div className=''>
          <div className='flex items-center justify-between'>
            <div className='hidden md:block'>
              <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
                Halo, {username}
              </h1>
              <p className='text-sm md:text-base text-muted-foreground'>
                {dayName}, {dateString}
              </p>
            </div>
            <Button asChild className='hidden md:flex bg-gradient-primary hover:bg-gradient-primary/90'>
              <Link href='/deals'>
                <Plus className='mr-2 h-4 w-4' />
                Jelajahi Promo
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mt-6'>
          {/* Active Coupons */}
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg'>
            <CardContent className='p-3 sm:p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-primary-foreground/90 text-xs sm:text-sm font-medium truncate'>Kupon Aktif</p>
                  <p className='text-xl sm:text-2xl md:text-3xl font-bold mt-1'>{totalActiveCoupons}</p>
                  <p className='text-primary-foreground/90 text-xs mt-1'>Siap digunakan</p>
                </div>
                <div className='rounded-full bg-primary-foreground/20 p-2 sm:p-2.5 md:p-3 flex-shrink-0'>
                  <Ticket className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-3 sm:p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Total Pesanan</p>
                  <p className='text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mt-1'>{totalOrders}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    <Button asChild variant='ghost' size='sm' className='h-auto p-0 text-xs text-muted-foreground hover:text-foreground'>
                      <Link href='/customer/orders'>
                        <Plus className='mr-1 h-3 w-3' />
                        <span className='hidden sm:inline'>Lihat Pesanan</span>
                        <span className='sm:hidden'>Lihat</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className='rounded-full bg-muted/20 p-2 sm:p-2.5 md:p-3 flex-shrink-0'>
                  <ShoppingBag className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Redeemed */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-3 sm:p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Digunakan</p>
                  <p className='text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mt-1'>{totalRedeemed}</p>
                  <p className='text-muted-foreground text-xs mt-1'>Kupon digunakan</p>
                </div>
                <div className='rounded-full bg-green-100 dark:bg-green-900/30 p-2 sm:p-2.5 md:p-3 flex-shrink-0'>
                  <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Savings */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-3 sm:p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Total Penghematan</p>
                  <p className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-card-foreground break-words mt-1'>
                    Rp {totalSavings.toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-xs mt-1'>Uang dihemat</p>
                </div>
                <div className='rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-2.5 md:p-3 flex-shrink-0'>
                  <TrendingUp className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3'>
          {/* Left Column - Active Coupons */}
          <div className='lg:col-span-2'>
            {/* Urgent Coupon Alert */}
            {!couponsLoading && nearestExpiringCoupon && isExpiringSoon && (
              <Card className='border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 shadow-lg mb-4 sm:mb-5 md:mb-6'>
                <CardHeader className='pb-2 sm:pb-3 px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400' />
                    <CardTitle className='text-sm sm:text-base md:text-lg text-orange-800 dark:text-orange-200'>Berakhir Segera</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
                  <CouponHeroStrip coupon={nearestExpiringCoupon} />
                </CardContent>
              </Card>
            )}

            {/* Active Coupons Section */}
            <Card className='mb-4 sm:mb-5 md:mb-6'>
              <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-base sm:text-lg md:text-xl'>Kupon Aktif Saya</CardTitle>
                    <CardDescription className='text-xs sm:text-sm md:text-base mt-1'>
                      {totalActiveCoupons} kupon siap digunakan
                    </CardDescription>
                  </div>
                  {activeCoupons.length > 0 && (
                    <Button asChild variant='outline' size='sm' className='text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4'>
                      <Link href='/customer/coupons'>
                        Lihat Semua
                        <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
                {couponsLoading && (
                  <div className='flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-hide'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-56 sm:h-64 md:h-72 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] flex-shrink-0 rounded-lg' />
                    ))}
                  </div>
                )}

                {!couponsLoading && activeCoupons.length === 0 && <EmptyCouponsState />}

                {!couponsLoading && activeCoupons.length > 0 && (
                  <ActiveCouponsCarousel coupons={activeCoupons} />
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
                <div className='flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-base sm:text-lg md:text-xl'>Pesanan Terbaru</CardTitle>
                    <CardDescription className='text-xs sm:text-sm md:text-base mt-1'>
                      Pembelian terbaru Anda
                    </CardDescription>
                  </div>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4 w-full sm:w-auto justify-between'
                  >
                    <Link href='/customer/orders'>
                      Lihat Semua
                      <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
                {ordersLoading && (
                  <div className='space-y-2 sm:space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-16 sm:h-20 md:h-24 w-full rounded-lg' />
                    ))}
                  </div>
                )}

                {!ordersLoading && orders.length === 0 && (
                  <div className='text-center py-6 sm:py-8 md:py-10'>
                    <ShoppingBag className='mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-muted-foreground' />
                    <p className='text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4'>Belum ada pesanan</p>
                    <Button asChild className='mt-4 sm:mt-5 h-9 sm:h-10 md:h-11 text-sm sm:text-base px-4 sm:px-6' size='sm'>
                      <Link href='/deals'>Jelajahi Promo</Link>
                    </Button>
                  </div>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className='space-y-2 sm:space-y-3'>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className='flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border bg-card/50 gap-3 sm:gap-4'>
                        <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                          <div className='rounded-full bg-primary/10 p-2 sm:p-2.5 flex-shrink-0'>
                            <ShoppingBag className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-sm sm:text-base text-card-foreground truncate'>{order.deal?.title || 'Pesanan'}</p>
                            <p className='text-xs sm:text-sm text-muted-foreground mt-0.5'>
                              {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <OrderStatusBadge status={order.status} />
                          <p className='text-sm sm:text-base font-medium mt-1 text-card-foreground'>
                            Rp {order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            {/* Recommended Deals */}
            <Card>
              <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
                <div className='flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-base sm:text-lg md:text-xl'>Rekomendasi</CardTitle>
                    <CardDescription className='text-xs sm:text-sm md:text-base mt-1'>
                      Promo untuk Anda
                    </CardDescription>
                  </div>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4 w-full sm:w-auto justify-between'
                  >
                    <Link href='/deals'>
                      Lihat Semua
                      <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
                {dealsLoading && (
                  <div className='space-y-2 sm:space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-24 sm:h-28 md:h-32 w-full rounded-lg' />
                    ))}
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length === 0 && (
                  <div className='text-center py-6 sm:py-8 md:py-10'>
                    <Sparkles className='mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-muted-foreground' />
                    <p className='text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4'>Tidak ada rekomendasi</p>
                    <Button asChild className='mt-4 sm:mt-5 h-9 sm:h-10 md:h-11 text-sm sm:text-base px-4 sm:px-6' size='sm'>
                      <Link href='/deals'>Jelajahi Promo</Link>
                    </Button>
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length > 0 && (
                  <div className='space-y-2 sm:space-y-3'>
                    {recommendedDeals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className='p-3 sm:p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors'>
                        <div className='flex items-start gap-3 sm:gap-4'>
                          <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0'>
                            <span className='text-white font-bold text-sm sm:text-base'>
                              {deal.merchant?.businessName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-sm sm:text-base line-clamp-2 text-card-foreground'>{deal.title}</h4>
                            <p className='text-xs sm:text-sm text-muted-foreground mt-1 truncate'>
                              {deal.merchant?.businessName}
                            </p>
                            <div className='flex items-center gap-2 sm:gap-3 mt-2 flex-wrap'>
                              <span className='text-sm sm:text-base font-bold text-primary'>
                                Rp {deal.dealPrice?.toLocaleString()}
                              </span>
                              <span className='text-xs sm:text-sm text-muted-foreground line-through'>
                                Rp {deal.discountPrice?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}


