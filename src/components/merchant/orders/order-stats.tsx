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
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Orders */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-tight">
            Total Orders
          </CardTitle>
          <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {formatNumber(stats.totalOrders)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All time orders
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-tight">
            Total Revenue
          </CardTitle>
          <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average: {formatCurrency(stats.averageOrderValue)}
          </p>
        </CardContent>
      </Card>

      {/* Paid Orders */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-tight">
            Paid Orders
          </CardTitle>
          <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-success">
            {formatNumber(stats.paidOrders)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.statusDistribution?.PAID || 0} paid
          </p>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-tight">
            Pending Orders
          </CardTitle>
          <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-warning">
            {formatNumber(stats.pendingOrders)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.statusDistribution?.PENDING || 0} pending
          </p>
        </CardContent>
      </Card>
    </div>
  )
}



