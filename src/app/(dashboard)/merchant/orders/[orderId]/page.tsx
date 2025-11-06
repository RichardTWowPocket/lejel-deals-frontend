'use client'

import { useParams, useRouter } from 'next/navigation'
import { OrderDetails } from '@/components/merchant/orders/order-details'
import { useMerchantOrder } from '@/hooks/merchant/use-merchant-orders'
import { ErrorDisplay, PageHeaderSkeleton } from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { MerchantRole } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const { data: order, isLoading, isFetching, error, refetch } = useMerchantOrder(orderId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <PageHeaderSkeleton />
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
        title="Failed to load order"
        description="We couldn't retrieve the order details. Please try again."
      />
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
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
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <OrderDetails order={order} />
      </div>
    </MerchantRoleProtectedRoute>
  )
}


