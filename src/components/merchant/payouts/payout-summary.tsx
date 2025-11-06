'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, TrendingUp, Package } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { formatNumber } from '@/utils/format'
import { PayoutSummary as PayoutSummaryType } from '@/types/payout'
import { cn } from '@/lib/utils'

interface PayoutSummaryProps {
  summary: PayoutSummaryType
  className?: string
}

export function PayoutSummary({ summary, className }: PayoutSummaryProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.period === 'all' ? 'All time' : `This ${summary.period}`}
          </p>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(summary.totalOrders)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.period === 'all' ? 'All time' : `This ${summary.period}`}
          </p>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.averageOrderValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per order
          </p>
        </CardContent>
      </Card>

      {/* Top Deals Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performing Deals</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(summary.topDeals?.length || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.topDeals?.length === 1 ? 'deal' : 'deals'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}



