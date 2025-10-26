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
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
              <p className='text-muted-foreground'>
                Today is {dayName} - {dateString}
              </p>
            </div>
            <Button asChild className='bg-gradient-primary hover:bg-gradient-primary/90'>
              <Link href='/deals'>
                <Plus className='mr-2 h-4 w-4' />
                Browse Deals
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Active Coupons */}
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-100 text-sm font-medium'>Active Coupons</p>
                  <p className='text-3xl font-bold'>{totalActiveCoupons}</p>
                  <p className='text-blue-100 text-xs mt-1'>Ready to use</p>
                </div>
                <div className='rounded-full bg-blue-400/20 p-3'>
                  <Ticket className='h-6 w-6 text-blue-100' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>Total Orders</p>
                  <p className='text-3xl font-bold text-card-foreground'>{totalOrders}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    <Button asChild variant='ghost' size='sm' className='h-auto p-0 text-xs text-muted-foreground hover:text-foreground'>
                      <Link href='/customer/orders'>
                        <Plus className='mr-1 h-3 w-3' />
                        View Orders
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className='rounded-full bg-muted/20 p-3'>
                  <ShoppingBag className='h-6 w-6 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Redeemed */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>Redeemed</p>
                  <p className='text-3xl font-bold text-card-foreground'>{totalRedeemed}</p>
                  <p className='text-muted-foreground text-xs mt-1'>Coupons used</p>
                </div>
                <div className='rounded-full bg-green-100 dark:bg-green-900/30 p-3'>
                  <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Savings */}
          <Card className='relative overflow-hidden border-0 bg-card shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>Total Savings</p>
                  <p className='text-3xl font-bold text-card-foreground'>Rp {totalSavings.toLocaleString()}</p>
                  <p className='text-muted-foreground text-xs mt-1'>Money saved</p>
                </div>
                <div className='rounded-full bg-purple-100 dark:bg-purple-900/30 p-3'>
                  <TrendingUp className='h-6 w-6 text-purple-600 dark:text-purple-400' />
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
              <Card className='border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                    <CardTitle className='text-orange-800 dark:text-orange-200'>Expiring Soon</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CouponHeroStrip coupon={nearestExpiringCoupon} />
                </CardContent>
              </Card>
            )}

            {/* Active Coupons Section */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>My Active Coupons</CardTitle>
                    <CardDescription>
                      {totalActiveCoupons} coupons ready to use
                    </CardDescription>
                  </div>
                  {activeCoupons.length > 0 && (
                    <Button asChild variant='outline' size='sm'>
                      <Link href='/customer/coupons'>
                        View All
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {couponsLoading && (
                  <div className='flex gap-4 overflow-x-auto'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-64 min-w-[280px] flex-shrink-0' />
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
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Your latest purchases
                    </CardDescription>
                  </div>
                  <Button asChild variant='outline' size='sm'>
                    <Link href='/customer/orders'>
                      View All
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading && (
                  <div className='space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-16 w-full' />
                    ))}
                  </div>
                )}

                {!ordersLoading && orders.length === 0 && (
                  <div className='text-center py-8'>
                    <ShoppingBag className='mx-auto h-12 w-12 text-muted-foreground' />
                    <p className='text-muted-foreground mt-2'>No orders yet</p>
                    <Button asChild className='mt-4' size='sm'>
                      <Link href='/deals'>Browse Deals</Link>
                    </Button>
                  </div>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className='space-y-3'>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className='flex items-center justify-between p-3 rounded-lg border border-border bg-card/50'>
                        <div className='flex items-center gap-3'>
                          <div className='rounded-full bg-primary/10 p-2'>
                            <ShoppingBag className='h-4 w-4 text-primary' />
                          </div>
                          <div>
                            <p className='font-medium text-card-foreground'>{order.deal?.title || 'Order'}</p>
                            <p className='text-sm text-muted-foreground'>
                              {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <OrderStatusBadge status={order.status} />
                          <p className='text-sm font-medium mt-1 text-card-foreground'>
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
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Recommended</CardTitle>
                    <CardDescription>
                      Deals for you
                    </CardDescription>
                  </div>
                  <Button asChild variant='outline' size='sm'>
                    <Link href='/deals'>
                      View All
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {dealsLoading && (
                  <div className='space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-32 w-full' />
                    ))}
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length === 0 && (
                  <div className='text-center py-8'>
                    <Sparkles className='mx-auto h-12 w-12 text-muted-foreground' />
                    <p className='text-muted-foreground mt-2'>No recommendations</p>
                    <Button asChild className='mt-4' size='sm'>
                      <Link href='/deals'>Browse Deals</Link>
                    </Button>
                  </div>
                )}

                {!dealsLoading && recommendedDeals.length > 0 && (
                  <div className='space-y-3'>
                    {recommendedDeals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className='p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors'>
                        <div className='flex items-start gap-3'>
                          <div className='w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0'>
                            <span className='text-white font-bold text-sm'>
                              {deal.merchant?.businessName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-sm line-clamp-1 text-card-foreground'>{deal.title}</h4>
                            <p className='text-xs text-muted-foreground mt-1'>
                              {deal.merchant?.businessName}
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                              <span className='text-sm font-bold text-primary'>
                                Rp {deal.dealPrice?.toLocaleString()}
                              </span>
                              <span className='text-xs text-muted-foreground line-through'>
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


