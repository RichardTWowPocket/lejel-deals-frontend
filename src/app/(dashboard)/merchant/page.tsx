'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MerchantOverview {
  merchant: {
    id: string
    name: string
    email: string
  }
  today: {
    orders: number
    redemptions: number
    revenue: number
    voucherValueRedeemed: number
    ordersDetails: any[]
    redemptionsDetails: any[]
  }
  activeDeals: number
  activeDealsList: any[]
  lowInventoryDeals: Array<{
    id: string
    title: string
    remaining: number
    total: number
    percentageLeft: number
  }>
  expiringSoonDeals: Array<{
    id: string
    title: string
    expiresAt: string
  }>
  redemptionRate: number
  alerts: {
    lowInventory: number
    expiringSoon: number
    hasAlerts: boolean
  }
}

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
  const [merchantId, setMerchantId] = useState<string>('demo-merchant-1') // TODO: Get from auth

  const { data, isLoading, error } = useQuery<MerchantOverview>({
    queryKey: ['merchantOverview', merchantId],
    queryFn: async () => {
      const { data } = await axios.get<MerchantOverview>(
        `${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}/overview`,
        { withCredentials: true }
      )
      return data
    },
    enabled: !!merchantId,
  })

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-8 w-24' />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load merchant overview. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  const kpiCards = [
    {
      title: 'Orders Today',
      value: data.today.orders,
      icon: ShoppingBag,
      description: 'Paid orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Redemptions Today',
      value: data.today.redemptions,
      icon: QrCode,
      description: 'Vouchers redeemed',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revenue Today',
      value: formatCurrency(data.today.revenue),
      icon: DollarSign,
      description: 'Total revenue',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Redemption Rate',
      value: `${data.redemptionRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Vouchers used',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground mt-1'>
          Welcome back, {data.merchant.name}
        </p>
      </div>

      {/* Alerts */}
      {data.alerts.hasAlerts && (
        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className='flex items-center gap-4 mt-2'>
            <span>
              {data.alerts.lowInventory > 0 && (
                <Badge variant='destructive' className='mr-2'>
                  {data.alerts.lowInventory} Low Inventory Deals
                </Badge>
              )}
              {data.alerts.expiringSoon > 0 && (
                <Badge variant='outline' className='mr-2'>
                  {data.alerts.expiringSoon} Expiring Soon
                </Badge>
              )}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {kpi.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-full ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{kpi.value}</div>
              <p className='text-xs text-muted-foreground mt-1'>{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Inventory Deals */}
      {data.lowInventoryDeals.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Package className='h-5 w-5 text-orange-600' />
                  Low Inventory Alert
                </CardTitle>
                <CardDescription>
                  {data.lowInventoryDeals.length} deals are running low
                </CardDescription>
              </div>
              <Link href='/merchant/deals'>
                <Button variant='outline'>View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {data.lowInventoryDeals.slice(0, 3).map((deal) => (
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
      {data.expiringSoonDeals.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-amber-600' />
                  Expiring Soon
                </CardTitle>
                <CardDescription>
                  {data.expiringSoonDeals.length} deals expiring within 7 days
                </CardDescription>
              </div>
              <Link href='/merchant/deals'>
                <Button variant='outline'>View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {data.expiringSoonDeals.slice(0, 3).map((deal) => (
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
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='h-5 w-5 text-blue-600' />
                Active Deals
              </CardTitle>
              <CardDescription>
                {data.activeDeals} deals are currently active
              </CardDescription>
            </div>
            <Link href='/merchant/deals'>
              <Button variant='outline'>Manage Deals</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <Activity className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-sm text-muted-foreground'>
                {data.activeDeals} active deals running
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
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
            {data.today.ordersDetails.length > 0 ? (
              <div className='space-y-3'>
                {data.today.ordersDetails.slice(0, 5).map((order: any) => (
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
            {data.today.redemptionsDetails.length > 0 ? (
              <div className='space-y-3'>
                {data.today.redemptionsDetails.slice(0, 5).map((redemption: any) => (
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
  )
}


