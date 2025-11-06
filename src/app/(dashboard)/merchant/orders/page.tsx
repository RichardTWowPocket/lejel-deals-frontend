'use client'

import { useState, useMemo } from 'react'
import { OrderFilters as OrderFiltersComponent } from '@/components/merchant/orders/order-filters'
import { OrderList } from '@/components/merchant/orders/order-list'
import { OrderStats } from '@/components/merchant/orders/order-stats'
import { useMerchantOrders } from '@/hooks/merchant/use-merchant-orders'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { OrderFilters, Order } from '@/types/order'
import { ErrorDisplay, PageHeaderSkeleton, OrdersListSkeleton } from '@/components/merchant/shared'
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
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <OrderStats />
        <OrderFiltersComponent className="opacity-50 pointer-events-none" />
        <OrdersListSkeleton />
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <OrderStats />

      <OrderFiltersComponent />

      {/* Background Refetch Indicator */}
      {!isLoading && isFetching && ordersData && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing orders...</span>
        </div>
      )}

      <OrderList data={ordersData} onViewDetails={handleViewDetails} />
    </div>
  )
}



