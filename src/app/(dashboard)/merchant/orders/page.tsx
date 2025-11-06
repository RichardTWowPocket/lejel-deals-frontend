'use client'

import { useState, useMemo } from 'react'
import { OrderFilters as OrderFiltersComponent } from '@/components/merchant/orders/order-filters'
import { OrderList } from '@/components/merchant/orders/order-list'
import { OrderStats } from '@/components/merchant/orders/order-stats'
import { useMerchantOrders } from '@/hooks/merchant/use-merchant-orders'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { OrderFilters, Order } from '@/types/order'
import { ErrorDisplay, PageHeaderSkeleton, OrdersListSkeleton } from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { MerchantRole } from '@/lib/constants'
import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const router = useRouter()
  
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

  const { filters } = useMerchantFilters<OrderFilters>({
    defaults: filterDefaults,
  })
  
  const { data: ordersData, isLoading, isFetching, error, refetch } = useMerchantOrders(filters)

  const handleViewDetails = (order: Order) => {
    router.push(`/merchant/orders/${order.id}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-0 md:space-y-6">
        <div className="hidden md:block">
          <PageHeaderSkeleton />
        </div>
        <OrderStats />
        <div className="!mt-4 md:!mt-0">
          <OrderFiltersComponent className="opacity-50 pointer-events-none" />
        </div>
        <div className="!mt-4 md:!mt-0">
          <OrdersListSkeleton />
        </div>
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
        title="Failed to load orders"
        description="We couldn't retrieve your orders. Please try again."
      />
    )
  }

  return (
    <MerchantRoleProtectedRoute
      requiredRoles={[
        MerchantRole.OWNER,
        MerchantRole.ADMIN,
        MerchantRole.MANAGER,
        MerchantRole.SUPERVISOR,
      ]}
    >
      <div className="space-y-0 md:space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <OrderStats />

      <div className="!mt-4 md:!mt-0">
        <OrderFiltersComponent />
      </div>

      {/* Background Refetch Indicator */}
      {!isLoading && isFetching && ordersData && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground !mt-4 md:!mt-0">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing orders...</span>
        </div>
      )}

      <div className="!mt-4 md:!mt-0">
        <OrderList data={ordersData} onViewDetails={handleViewDetails} />
      </div>
      </div>
    </MerchantRoleProtectedRoute>
  )
}


