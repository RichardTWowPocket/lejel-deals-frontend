'use client'

import { RedemptionStats as RedemptionStatsType } from '@/types/redemption'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { formatNumber } from '@/utils/format'
import { cn } from '@/lib/utils'

interface RedemptionStatsProps {
  stats: RedemptionStatsType
  className?: string
}

export function RedemptionStats({ stats, className }: RedemptionStatsProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Total Redemptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalRedemptions)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All time redemptions
          </p>
        </CardContent>
      </Card>

      {/* Completed Redemptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatNumber(stats.completedRedemptions)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.completionRate.toFixed(1)}% completion rate
          </p>
        </CardContent>
      </Card>

      {/* Recent Redemptions (Last 24h) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent (24h)</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.recentRedemptions)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 24 hours
          </p>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-medium">{formatNumber(stats.statusDistribution.completed)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-medium">{formatNumber(stats.statusDistribution.pending)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cancelled:</span>
              <span className="font-medium">{formatNumber(stats.statusDistribution.cancelled)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



