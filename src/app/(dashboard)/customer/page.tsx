'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
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
import { DealCard } from '@/components/deal/deal-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { OrderStatusBadge } from '@/components/ui/order-status-badge'
import { 
  Sparkles, 
  ShoppingBag, 
  Ticket, 
  QrCode, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Eye,
  Calendar,
  Plus
} from 'lucide-react'

export default function CustomerDashboardPage() {
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

  // Calculate stats
  const totalActiveCoupons = couponsData?.pagination?.total || 0
  const totalOrders = ordersData?.pagination?.total || 0
  const totalRedeemed = activeCoupons.filter(c => c.status === 'USED').length
  const totalSavings = orders.reduce((sum, order) => sum + (order.deal?.discountPrice || 0), 0)

  // Get current date info
  const today = new Date()
  const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' })
  const dateString = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='hidden md:block'>
              <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Dashboard</h1>
              <p className='text-muted-foreground'>
                Today is {dayName} - {dateString}
              </p>
            </div>
            <Button asChild className='hidden md:flex bg-gradient-primary hover:bg-gradient-primary/90'>
              <Link href='/deals'>
                <Plus className='mr-2 h-4 w-4' />
                Browse Deals
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6'>
          {/* Active Coupons */}
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'>
            <CardContent className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-blue-100 text-xs sm:text-sm font-medium truncate'>Active Coupons</p>
                  <p className='text-2xl sm:text-3xl font-bold'>{totalActiveCoupons}</p>
                  <p className='text-blue-100 text-[10px] sm:text-xs mt-1'>Ready to use</p>
                </div>
                <div className='rounded-full bg-blue-400/20 p-2 sm:p-3 flex-shrink-0'>
                  <Ticket className='h-5 w-5 sm:h-6 sm:w-6 text-blue-100' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Total Orders</p>
                  <p className='text-2xl sm:text-3xl font-bold text-card-foreground'>{totalOrders}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    <Button asChild variant='ghost' size='sm' className='h-auto p-0 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground'>
                      <Link href='/customer/orders'>
                        <Plus className='mr-1 h-3 w-3' />
                        <span className='hidden sm:inline'>View Orders</span>
                        <span className='sm:hidden'>View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className='rounded-full bg-muted/20 p-2 sm:p-3 flex-shrink-0'>
                  <ShoppingBag className='h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Redeemed */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Redeemed</p>
                  <p className='text-2xl sm:text-3xl font-bold text-card-foreground'>{totalRedeemed}</p>
                  <p className='text-muted-foreground text-[10px] sm:text-xs mt-1'>Coupons used</p>
                </div>
                <div className='rounded-full bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 flex-shrink-0'>
                  <CheckCircle className='h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Savings */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs sm:text-sm font-medium truncate'>Total Savings</p>
                  <p className='text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground break-words'>
                    Rp {totalSavings.toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-[10px] sm:text-xs mt-1'>Money saved</p>
                </div>
                <div className='rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 flex-shrink-0'>
                  <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left Column - Active Coupons */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Urgent Coupon Alert */}
            {!couponsLoading && nearestExpiringCoupon && (
              <Card className='border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 shadow-lg'>
                <CardHeader className='pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400' />
                    <CardTitle className='text-sm sm:text-base text-orange-800 dark:text-orange-200'>Expiring Soon</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='px-3 sm:px-6 pb-3 sm:pb-6'>
                  <CouponHeroStrip coupon={nearestExpiringCoupon} />
                </CardContent>
              </Card>
            )}

            {/* Active Coupons Section */}
            <Card>
              <CardHeader className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg sm:text-xl'>My Active Coupons</CardTitle>
                    <CardDescription className='text-xs sm:text-sm'>
                      {totalActiveCoupons} coupons ready to use
                    </CardDescription>
                  </div>
                  {activeCoupons.length > 0 && (
                    <Button asChild variant='outline' size='sm' className='text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4'>
                      <Link href='/customer/coupons'>
                        View All
                        <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className='px-3 sm:px-6 pb-4 sm:pb-6'>
                {couponsLoading && (
                  <div className='flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-56 sm:h-64 min-w-[240px] sm:min-w-[280px] flex-shrink-0 rounded-lg' />
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
              <CardHeader className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg sm:text-xl'>Recent Orders</CardTitle>
                    <CardDescription className='text-xs sm:text-sm'>
                      Your latest purchases
                    </CardDescription>
                  </div>
                  <Button asChild variant='outline' size='sm' className='text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4'>
                    <Link href='/customer/orders'>
                      View All
                      <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='px-3 sm:px-6 pb-4 sm:pb-6'>
                {ordersLoading && (
                  <div className='space-y-2 sm:space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-14 sm:h-16 w-full rounded-lg' />
                    ))}
                  </div>
                )}

                {!ordersLoading && orders.length === 0 && (
                  <div className='text-center py-6 sm:py-8'>
                    <ShoppingBag className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground' />
                    <p className='text-xs sm:text-sm text-muted-foreground mt-2'>No orders yet</p>
                    <Button asChild className='mt-3 sm:mt-4 h-8 sm:h-9 text-xs sm:text-sm' size='sm'>
                      <Link href='/deals'>Browse Deals</Link>
                    </Button>
                  </div>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className='space-y-2 sm:space-y-3'>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className='flex items-center justify-between p-2 sm:p-3 rounded-lg border border-border bg-card/50 gap-2 sm:gap-3'>
                        <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                          <div className='rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0'>
                            <ShoppingBag className='h-3 w-3 sm:h-4 sm:w-4 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-xs sm:text-sm text-card-foreground truncate'>{order.deal?.title || 'Order'}</p>
                            <p className='text-[10px] sm:text-xs text-muted-foreground'>
                              {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <OrderStatusBadge status={order.status} />
                          <p className='text-xs sm:text-sm font-medium mt-1 text-card-foreground'>
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
          <div className='space-y-6'>
            {/* Recommended Deals */}
            <Card>
              <CardHeader className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg sm:text-xl'>Recommended</CardTitle>
                    <CardDescription className='text-xs sm:text-sm'>
                      Deals for you
                    </CardDescription>
                  </div>
                  <Button asChild variant='outline' size='sm' className='text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4'>
                    <Link href='/deals'>
                      View All
                      <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='px-3 sm:px-6 pb-4 sm:pb-6'>
                {dealsLoading && (
                  <div className='space-y-2 sm:space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-24 sm:h-32 w-full rounded-lg' />
                    ))}
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length === 0 && (
                  <div className='text-center py-6 sm:py-8'>
                    <Sparkles className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground' />
                    <p className='text-xs sm:text-sm text-muted-foreground mt-2'>No recommendations</p>
                    <Button asChild className='mt-3 sm:mt-4 h-8 sm:h-9 text-xs sm:text-sm' size='sm'>
                      <Link href='/deals'>Browse Deals</Link>
                    </Button>
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length > 0 && (
                  <div className='space-y-2 sm:space-y-3'>
                    {recommendedDeals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className='p-2 sm:p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors'>
                        <div className='flex items-start gap-2 sm:gap-3'>
                          <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0'>
                            <span className='text-white font-bold text-xs sm:text-sm'>
                              {deal.merchant?.businessName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-xs sm:text-sm line-clamp-2 text-card-foreground'>{deal.title}</h4>
                            <p className='text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate'>
                              {deal.merchant?.businessName}
                            </p>
                            <div className='flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap'>
                              <span className='text-xs sm:text-sm font-bold text-primary'>
                                Rp {deal.dealPrice?.toLocaleString()}
                              </span>
                              <span className='text-[10px] sm:text-xs text-muted-foreground line-through'>
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

            {/* Notifications */}
            <NotificationsPreview />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}


