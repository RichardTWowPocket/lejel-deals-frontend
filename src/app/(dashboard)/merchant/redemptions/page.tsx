'use client'

import { useState, useMemo } from 'react'
import { RedemptionFilters as RedemptionFiltersComponent } from '@/components/merchant/redemptions/redemption-filters'
import { RedemptionList } from '@/components/merchant/redemptions/redemption-list'
import { RedemptionStats } from '@/components/merchant/redemptions/redemption-stats'
import { RedemptionExport } from '@/components/merchant/redemptions/redemption-export'
import { useMerchantRedemptions } from '@/hooks/merchant/use-merchant-redemptions'
import { useRedemptionStats } from '@/hooks/merchant/use-redemption-stats'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { RedemptionFilters, RedemptionResponse } from '@/types/redemption'
import { ErrorDisplay, PageHeaderSkeleton, RedemptionsListSkeleton } from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { MerchantRole } from '@/lib/constants'
import { Receipt } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/format'

export default function RedemptionsPage() {
  // Memoize defaults to prevent infinite loops
  const filterDefaults = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return {
      page: 1,
      limit: 10,
      // Default to last 30 days
      startDate: thirtyDaysAgo.toISOString(),
      endDate: now.toISOString(),
    }
  }, []) // Empty dependency array - only calculate once

  const { filters } = useMerchantFilters<RedemptionFilters>({
    defaults: filterDefaults,
  })

  const { data, isLoading, isFetching, error, refetch } = useMerchantRedemptions(filters)
  const { data: stats, isLoading: statsLoading, isFetching: statsFetching } = useRedemptionStats()

  const [selectedRedemption, setSelectedRedemption] = useState<RedemptionResponse | null>(null)

  const handleViewDetails = (redemption: RedemptionResponse) => {
    setSelectedRedemption(redemption)
  }

  // Only show loading skeleton if we have no cached data at all
  // This prevents showing loading when we have cached data but are refetching in background
  if (isLoading && !data && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeaderSkeleton />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <RedemptionsListSkeleton />
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
        title="Failed to load redemptions"
        description="We couldn't retrieve your redemptions. Please try again."
      />
    )
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
            <h1 className="text-2xl font-bold">Redemptions</h1>
            <p className="text-sm text-muted-foreground">
              View and manage all coupon redemptions
            </p>
          </div>
          <RedemptionExport />
        </div>

      {/* Statistics Cards */}
      {stats && <RedemptionStats stats={stats} />}

      {/* Filters */}
      <RedemptionFiltersComponent />

      {/* Background Refetch Indicator */}
      {((!isLoading && isFetching && data) || (!statsLoading && statsFetching && stats)) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing redemptions...</span>
        </div>
      )}

      {/* Redemptions List */}
      <RedemptionList data={data} onViewDetails={handleViewDetails} />

      {/* Details Modal */}
      <Dialog open={!!selectedRedemption} onOpenChange={() => setSelectedRedemption(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRedemption && (
            <>
              <DialogHeader>
                <DialogTitle>Redemption Details</DialogTitle>
                <DialogDescription>
                  Full details for redemption #{selectedRedemption.id.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Customer Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Customer</h3>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {selectedRedemption.customer?.firstName}{' '}
                      {selectedRedemption.customer?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRedemption.customer?.email}
                    </p>
                  </div>
                </div>

                {/* Deal Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Deal</h3>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedRedemption.deal?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Voucher Value: {formatCurrency(selectedRedemption.deal?.discountPrice || 0)}
                    </p>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Order</h3>
                  <div className="space-y-1">
                    <p className="font-medium">
                      Order #{selectedRedemption.order?.orderNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatCurrency(selectedRedemption.order?.totalAmount || 0)}
                    </p>
                  </div>
                </div>

                {/* Redemption Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Redemption</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{selectedRedemption.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Redeemed At:</span>
                      <span className="font-medium">
                        {format(new Date(selectedRedemption.redeemedAt), 'PPp')}
                      </span>
                    </div>
                    {selectedRedemption.notes && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="font-medium">{selectedRedemption.notes}</span>
                      </div>
                    )}
                    {selectedRedemption.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedRedemption.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MerchantRoleProtectedRoute>
  )
}



