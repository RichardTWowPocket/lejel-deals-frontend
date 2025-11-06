'use client'

import { 
  TrendingUp, 
  ShoppingBag, 
  QrCode, 
  DollarSign, 
  AlertTriangle,
  Clock,
  Package,
  Tag,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  ErrorDisplay,
  KPICardsSkeleton,
  PageHeaderSkeleton,
} from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { MerchantRole } from '@/lib/constants'
import Link from 'next/link'
import { useMerchantOverview, type MerchantOverview } from '@/hooks/merchant'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days}d ${hours}h`
  } else {
    return `${hours}h`
  }
}

export default function MerchantOverviewPage() {
  const { data, isLoading, isFetching, error, refetch } = useMerchantOverview()

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeaderSkeleton />
        <KPICardsSkeleton count={4} />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => {
          refetch().catch(console.error)
        }}
        title="Gagal memuat dashboard merchant"
      />
    )
  }

  if (!data) return null

  // Background refetch indicator
  const isRefreshing = !isLoading && isFetching

  // Handle both old API structure (flat) and new structure (nested)
  // Backend currently returns: { merchantId, todayOrders, todayRevenue, totalRevenue, activeDeals }
  // Frontend expects: { merchant, today: { orders, redemptions, revenue, ... }, ... }
  const todayOrders = (data as any).today?.orders ?? (data as any).todayOrders ?? 0
  const todayRedemptions = (data as any).today?.redemptions ?? 0
  const todayRevenue = typeof (data as any).today?.revenue === 'number' 
    ? (data as any).today.revenue 
    : typeof (data as any).todayRevenue === 'string'
    ? parseFloat((data as any).todayRevenue)
    : (data as any).todayRevenue ?? 0
  const redemptionRate = (data as any).redemptionRate ?? 0
  const merchantName = (data as any).merchant?.name ?? 'Merchant'
  const activeDeals = (data as any).activeDeals ?? 0
  const lowInventoryDeals = (data as any).lowInventoryDeals ?? []
  const expiringSoonDeals = (data as any).expiringSoonDeals ?? []
  const alerts = (data as any).alerts ?? { hasAlerts: false, lowInventory: 0, expiringSoon: 0 }
  const ordersDetails = (data as any).today?.ordersDetails ?? []
  const redemptionsDetails = (data as any).today?.redemptionsDetails ?? []

  const kpiCards = [
    {
      title: 'Orders Today',
      value: todayOrders,
      icon: ShoppingBag,
      description: 'Paid orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Redemptions Today',
      value: todayRedemptions,
      icon: QrCode,
      description: 'Vouchers redeemed',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revenue Today',
      value: formatCurrency(todayRevenue),
      icon: DollarSign,
      description: 'Total revenue',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Redemption Rate',
      value: `${redemptionRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Vouchers used',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <MerchantRoleProtectedRoute
      requiredRoles={[
        MerchantRole.OWNER,
        MerchantRole.ADMIN,
        MerchantRole.MANAGER,
        MerchantRole.SUPERVISOR,
        MerchantRole.CASHIER,
      ]}
    >
      <div className='space-y-0 md:space-y-6'>
        {/* Background Refetch Indicator */}
        {isRefreshing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Refreshing dashboard...</span>
          </div>
        )}

      {/* Header - Hidden on mobile, visible on md and up */}
      <div className='hidden md:block'>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground mt-1'>
          Welcome back, {merchantName}
        </p>
      </div>

      {/* Alerts */}
      {alerts.hasAlerts && (
        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className='flex items-center gap-4 mt-2'>
            <span>
              {alerts.lowInventory > 0 && (
                <Badge variant='destructive' className='mr-2'>
                  {alerts.lowInventory} Low Inventory Deals
                </Badge>
              )}
              {alerts.expiringSoon > 0 && (
                <Badge variant='outline' className='mr-2'>
                  {alerts.expiringSoon} Expiring Soon
                </Badge>
              )}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards - Responsive grid: 2 cols on mobile, 2 on tablet, 4 on desktop */}
      <div className='grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6'>
              <CardTitle className='text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-tight'>
                {kpi.title}
              </CardTitle>
              <div className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full ${kpi.bgColor} flex items-center justify-center flex-shrink-0`}>
                <kpi.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className='p-3 sm:p-6 pt-0'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight'>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Inventory Deals */}
      {lowInventoryDeals.length > 0 && (
        <Card className='!mt-4 md:!mt-0'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Package className='h-5 w-5 text-orange-600' />
                  Low Inventory Alert
                </CardTitle>
                <CardDescription>
                  {lowInventoryDeals.length} deals are running low
                </CardDescription>
              </div>
              <Link href='/merchant/deals'>
                <Button variant='outline' className='w-full sm:w-auto'>View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {lowInventoryDeals.slice(0, 3).map((deal: any) => (
                <div key={deal.id} className='flex items-center justify-between p-3 rounded-lg bg-muted/30'>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{deal.title}</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {deal.remaining} of {deal.total} remaining ({deal.percentageLeft.toFixed(0)}%)
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant={deal.percentageLeft < 10 ? 'destructive' : 'secondary'}>
                      {deal.percentageLeft.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon Deals */}
      {expiringSoonDeals.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-amber-600' />
                  Expiring Soon
                </CardTitle>
                <CardDescription>
                  {expiringSoonDeals.length} deals expiring within 7 days
                </CardDescription>
              </div>
              <Link href='/merchant/deals'>
                <Button variant='outline' className='w-full sm:w-auto'>View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {expiringSoonDeals.slice(0, 3).map((deal: any) => (
                <div key={deal.id} className='flex items-center justify-between p-3 rounded-lg bg-muted/30'>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{deal.title}</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Expires in {formatTimeRemaining(deal.expiresAt)}
                    </p>
                  </div>
                  <Clock className='h-4 w-4 text-amber-600' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Deals Summary */}
      <Card className='!mt-4 md:!mt-0'>
        <CardHeader>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='h-5 w-5 text-blue-600' />
                Active Deals
              </CardTitle>
              <CardDescription>
                {activeDeals} deals are currently active
              </CardDescription>
            </div>
            <Link href='/merchant/deals'>
              <Button variant='outline' className='w-full sm:w-auto'>Manage Deals</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <Activity className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-sm text-muted-foreground'>
                {activeDeals} active deals running
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2 !mt-4 md:!mt-0'>
        {/* Today's Orders */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5' />
              Recent Orders
            </CardTitle>
            <CardDescription>Last 5 orders today</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersDetails.length > 0 ? (
              <div className='space-y-3'>
                {ordersDetails.slice(0, 5).map((order: any) => (
                  <div key={order.id} className='flex items-center justify-between p-3 rounded-lg bg-muted/30'>
                    <div>
                      <p className='text-sm font-medium'>{order.orderNumber}</p>
                      <p className='text-xs text-muted-foreground'>{order.customer?.firstName} {order.customer?.lastName}</p>
                    </div>
                    <Badge variant='secondary'>{formatCurrency(Number(order.totalAmount))}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-sm text-muted-foreground'>
                No orders today
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5' />
              Recent Redemptions
            </CardTitle>
            <CardDescription>Last 5 redemptions today</CardDescription>
          </CardHeader>
          <CardContent>
            {redemptionsDetails.length > 0 ? (
              <div className='space-y-3'>
                {redemptionsDetails.slice(0, 5).map((redemption: any) => (
                  <div key={redemption.id} className='flex items-center justify-between p-3 rounded-lg bg-muted/30'>
                    <div>
                      <p className='text-sm font-medium'>{redemption.coupon.deal.title}</p>
                      <p className='text-xs text-muted-foreground'>
                        Order: {redemption.coupon.order.orderNumber}
                      </p>
                    </div>
                    <Badge variant='success'>Redeemed</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-sm text-muted-foreground'>
                No redemptions today
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </MerchantRoleProtectedRoute>
  )
}



