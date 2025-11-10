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
  Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
      <div className='px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6'>
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

  type KpiCard = {
    label: string
    value: string | number
    helper: string
    icon: LucideIcon
    highlight?: boolean
    cardClass?: string
    labelClass?: string
    valueClass?: string
    helperClass?: string
    iconWrapperClass: string
    iconClass: string
  }

  const kpiCards: KpiCard[] = [
    {
      label: 'Pesanan Hari Ini',
      value: todayOrders,
      helper: 'Pesanan berhasil',
      icon: ShoppingBag,
      highlight: true,
      cardClass: 'bg-gradient-to-br from-primary to-secondary text-primary-foreground',
      labelClass: 'text-primary-foreground/90',
      valueClass: 'text-primary-foreground',
      helperClass: 'text-primary-foreground/80',
      iconWrapperClass: 'rounded-full bg-primary-foreground/20 p-2 sm:p-2.5 md:p-3 flex-shrink-0',
      iconClass: 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-foreground',
    },
    {
      label: 'Penukaran Hari Ini',
      value: todayRedemptions,
      helper: 'Kupon berhasil dipindai',
      icon: QrCode,
      iconWrapperClass: 'rounded-full bg-green-100 dark:bg-green-900/30 p-2 sm:p-2.5 md:p-3 flex-shrink-0',
      iconClass: 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400',
    },
    {
      label: 'Pendapatan Hari Ini',
      value: formatCurrency(todayRevenue),
      helper: 'Total pendapatan',
      icon: DollarSign,
      iconWrapperClass: 'rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2 sm:p-2.5 md:p-3 flex-shrink-0',
      iconClass: 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Tingkat Penukaran',
      value: `${redemptionRate.toFixed(1)}%`,
      helper: 'Kupon digunakan',
      icon: TrendingUp,
      iconWrapperClass: 'rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-2.5 md:p-3 flex-shrink-0',
      iconClass: 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400',
    },
  ] as const

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
      <div className='mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
        {/* Background Refetch Indicator */}
        {isRefreshing && (
          <div className='mb-4 flex items-center gap-2 text-sm text-muted-foreground'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
            <span>Menyegarkan data dashboard...</span>
          </div>
        )}

        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
              Halo, {merchantName}
            </h1>
            <p className='text-sm md:text-base text-muted-foreground mt-1'>
              Pantau performa bisnis Anda hari ini
            </p>
          </div>
          <Button
            asChild
            className='hidden md:flex bg-gradient-primary hover:bg-gradient-primary/90 h-10 md:h-11 px-4 md:px-6 text-sm md:text-base'
          >
            <Link href='/merchant/deals'>
              <Plus className='mr-2 h-4 w-4' />
              Kelola Promo
            </Link>
          </Button>
        </div>

        <Button
          asChild
          className='mt-4 w-full md:hidden bg-gradient-primary hover:bg-gradient-primary/90 h-10 text-sm'
        >
          <Link href='/merchant/deals'>
            <Plus className='mr-2 h-4 w-4' />
            Kelola Promo
          </Link>
        </Button>

        {/* Alerts */}
        {alerts.hasAlerts && (
          <Alert className='mt-6 sm:mt-8'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Tindakan diperlukan</AlertTitle>
            <AlertDescription className='mt-3 flex flex-wrap items-center gap-2 text-sm'>
              {alerts.lowInventory > 0 && (
                <Badge variant='destructive' className='text-xs sm:text-sm'>
                  {alerts.lowInventory} stok menipis
                </Badge>
              )}
              {alerts.expiringSoon > 0 && (
                <Badge variant='outline' className='text-xs sm:text-sm'>
                  {alerts.expiringSoon} segera berakhir
                </Badge>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8'>
        {kpiCards.map((kpi) => {
          const isHighlight = kpi.highlight
          const cardBaseClass = isHighlight
            ? `relative overflow-hidden border-0 shadow-lg transition-shadow ${kpi.cardClass ?? ''}`
            : 'relative overflow-hidden border-0 bg-card shadow-lg transition-shadow'
          const labelClass = `${isHighlight ? kpi.labelClass ?? 'text-primary-foreground/90' : 'text-muted-foreground'} text-xs sm:text-sm font-medium truncate`
          const valueClass = `${isHighlight ? kpi.valueClass ?? 'text-primary-foreground' : 'text-card-foreground'} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1`
          const helperClass = `${isHighlight ? kpi.helperClass ?? 'text-primary-foreground/80' : 'text-muted-foreground'} text-xs mt-1`

          return (
            <Card key={kpi.label} className={cardBaseClass}>
              <CardContent className='p-3 sm:p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1 min-w-0'>
                    <p className={labelClass}>{kpi.label}</p>
                    <p className={valueClass}>{kpi.value}</p>
                    <p className={helperClass}>{kpi.helper}</p>
                  </div>
                  <div className={kpi.iconWrapperClass}>
                    <kpi.icon className={kpi.iconClass} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

        {/* Low Inventory Deals */}
        {lowInventoryDeals.length > 0 && (
          <Card className='mt-6 sm:mt-8 border-0 shadow-lg'>
            <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                <div>
                  <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold'>
                    <Package className='h-5 w-5 text-orange-600' />
                    Persediaan Menipis
                  </CardTitle>
                  <CardDescription className='text-xs sm:text-sm mt-1'>
                    {lowInventoryDeals.length} promo mendekati batas stok
                  </CardDescription>
                </div>
                <Button
                  asChild
                  variant='outline'
                  className='h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm w-full sm:w-auto'
                >
                  <Link href='/merchant/deals'>Lihat Semua</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
              <div className='space-y-3 sm:space-y-4'>
                {lowInventoryDeals.slice(0, 3).map((deal: any) => (
                  <div
                    key={deal.id}
                    className='flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-3 sm:px-4 sm:py-3.5'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm sm:text-base truncate'>{deal.title}</p>
                      <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                        Sisa {deal.remaining} dari {deal.total} kuota ({deal.percentageLeft.toFixed(0)}%)
                      </p>
                    </div>
                    <Badge
                      variant={deal.percentageLeft < 10 ? 'destructive' : 'secondary'}
                      className='text-xs sm:text-sm'
                    >
                      {deal.percentageLeft.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expiring Soon Deals */}
        {expiringSoonDeals.length > 0 && (
          <Card className='mt-6 sm:mt-8 border-0 shadow-lg'>
            <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                <div>
                  <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold'>
                    <Clock className='h-5 w-5 text-amber-600' />
                    Segera Berakhir
                  </CardTitle>
                  <CardDescription className='text-xs sm:text-sm mt-1'>
                    {expiringSoonDeals.length} promo berakhir dalam 7 hari
                  </CardDescription>
                </div>
                <Button
                  asChild
                  variant='outline'
                  className='h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm w-full sm:w-auto'
                >
                  <Link href='/merchant/deals'>Kelola Promo</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
              <div className='space-y-3 sm:space-y-4'>
                {expiringSoonDeals.slice(0, 3).map((deal: any) => (
                  <div
                    key={deal.id}
                    className='flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-3 sm:px-4 sm:py-3.5'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm sm:text-base truncate'>{deal.title}</p>
                      <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                        Berakhir dalam {formatTimeRemaining(deal.expiresAt)}
                      </p>
                    </div>
                    <Clock className='h-4 w-4 text-amber-600 flex-shrink-0' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Deals Summary */}
        <Card className='mt-6 sm:mt-8 border-0 shadow-lg'>
          <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
              <div>
                <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold'>
                  <Tag className='h-5 w-5 text-blue-600' />
                  Promo Aktif
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm mt-1'>
                  {activeDeals} promo sedang berjalan
                </CardDescription>
              </div>
              <Button
                asChild
                variant='outline'
                className='h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm w-full sm:w-auto'
              >
                <Link href='/merchant/deals'>Kelola Promo</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='px-4 sm:px-5 md:px-6 pb-6 sm:pb-7 md:pb-8'>
            <div className='flex items-center justify-center py-8 sm:py-10'>
              <div className='text-center'>
                <Activity className='h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4' />
                <p className='text-sm sm:text-base text-muted-foreground'>
                  {activeDeals} promo aktif tersedia untuk pelanggan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className='grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2 mt-6 sm:mt-8'>
          {/* Today's Orders */}
          <Card className='border-0 shadow-lg'>
            <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold'>
                <ShoppingBag className='h-5 w-5 text-primary' />
                Pesanan Terbaru
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm mt-1'>
                5 pesanan terbaru hari ini
              </CardDescription>
            </CardHeader>
            <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
              {ordersDetails.length > 0 ? (
                <div className='space-y-3 sm:space-y-4'>
                  {ordersDetails.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className='flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-3 sm:px-4 sm:py-3.5'
                    >
                      <div className='min-w-0'>
                        <p className='text-sm sm:text-base font-medium truncate'>{order.orderNumber}</p>
                        <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                      </div>
                      <Badge variant='secondary' className='text-xs sm:text-sm whitespace-nowrap'>
                        {formatCurrency(Number(order.totalAmount))}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 sm:py-10 text-sm sm:text-base text-muted-foreground'>
                  Belum ada pesanan hari ini
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Redemptions */}
          <Card className='border-0 shadow-lg'>
            <CardHeader className='px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-6'>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg font-semibold'>
                <CheckCircle2 className='h-5 w-5 text-green-600' />
                Penukaran Terbaru
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm mt-1'>
                5 penukaran kupon terakhir hari ini
              </CardDescription>
            </CardHeader>
            <CardContent className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6'>
              {redemptionsDetails.length > 0 ? (
                <div className='space-y-3 sm:space-y-4'>
                  {redemptionsDetails.slice(0, 5).map((redemption: any) => (
                    <div
                      key={redemption.id}
                      className='flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-3 sm:px-4 sm:py-3.5'
                    >
                      <div className='min-w-0'>
                        <p className='text-sm sm:text-base font-medium truncate'>
                          {redemption.coupon.deal.title}
                        </p>
                        <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                          Order: {redemption.coupon.order.orderNumber}
                        </p>
                      </div>
                      <Badge variant='success' className='text-xs sm:text-sm whitespace-nowrap'>
                        Berhasil
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 sm:py-10 text-sm sm:text-base text-muted-foreground'>
                  Belum ada penukaran hari ini
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MerchantRoleProtectedRoute>
  )
}



