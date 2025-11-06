'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PayoutSummary } from '@/components/merchant/payouts/payout-summary'
import { PayoutTable } from '@/components/merchant/payouts/payout-table'
import { PayoutExport } from '@/components/merchant/payouts/payout-export'
import { useMerchantPayouts } from '@/hooks/merchant/use-merchant-payouts'
import { ErrorDisplay, PageHeaderSkeleton, KPICardsSkeleton, PayoutChartSkeleton } from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { MerchantRole } from '@/lib/constants'
import { PayoutPeriod } from '@/types/payout'
import { DollarSign } from 'lucide-react'

// Lazy load heavy chart component
const PayoutChart = dynamic(
  () => import('@/components/merchant/payouts/payout-chart').then((mod) => ({ default: mod.PayoutChart })),
  {
    loading: () => <PayoutChartSkeleton />,
    ssr: false, // Charts don't need SSR
  }
)

export default function PayoutsPage() {
  const [period, setPeriod] = useState<PayoutPeriod>('month')

  const { data: payoutData, isLoading, error, refetch } = useMerchantPayouts(period)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <KPICardsSkeleton />
        <PayoutChartSkeleton />
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
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
        title="Failed to load payouts"
        description="We couldn't retrieve your payout data. Please try again."
      />
    )
  }

  if (!payoutData) {
    return null
  }

  // Provide default summary if missing
  const summary = payoutData.summary || {
    period: period,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topDeals: [],
  }

  return (
    <MerchantRoleProtectedRoute
      requiredRoles={[
        MerchantRole.OWNER,
        MerchantRole.ADMIN,
        MerchantRole.MANAGER,
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Payouts & Revenue
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your revenue, orders, and payouts
            </p>
          </div>
          <PayoutExport period={period} />
        </div>

      {/* Summary Cards */}
      <PayoutSummary summary={summary} />

      {/* Revenue Chart */}
      <PayoutChart
        dailyTrends={payoutData.dailyTrends || []}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Payout Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <p className="text-sm text-muted-foreground">
            Showing first {payoutData.orders?.length || 0} of {payoutData.totalRecords || 0} orders
          </p>
        </div>
        <PayoutTable
          orders={payoutData.orders || []}
          summary={summary}
        />
      </div>
      </div>
    </MerchantRoleProtectedRoute>
  )
}


