'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Clock, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react'
import { useOrderStats } from '@/hooks/merchant/use-order-stats'
import { formatNumber } from '@/utils/format'
import { formatCurrency } from '@/utils/format'
import { KPICardsSkeleton } from '@/components/merchant/shared/loading-skeleton'
import { ErrorDisplay } from '@/components/merchant/shared'

export function OrderStats() {
  const { data: stats, isLoading, error, refetch } = useOrderStats()

  if (isLoading) {
    return <KPICardsSkeleton />
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => refetch()}
        title="Failed to load order statistics"
        description="We couldn't retrieve your order stats. Please try again."
      />
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats.totalOrders)}
          </div>
          <p className="text-xs text-muted-foreground">
            All time orders
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average: {formatCurrency(stats.averageOrderValue)}
          </p>
        </CardContent>
      </Card>

      {/* Paid Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatNumber(stats.paidOrders)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.statusDistribution?.PAID || 0} paid
          </p>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {formatNumber(stats.pendingOrders)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.statusDistribution?.PENDING || 0} pending
          </p>
        </CardContent>
      </Card>
    </div>
  )
}



