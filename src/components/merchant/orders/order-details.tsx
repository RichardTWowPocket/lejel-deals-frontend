'use client'

import { Order } from '@/types/order'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { User, ShoppingBag, Ticket, CreditCard, Calendar, Hash } from 'lucide-react'
import { OrderStatusBadge } from './order-status-badge'
import { OrderTimeline } from './order-timeline'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface OrderDetailsProps {
  order: Order
  className?: string
}

export function OrderDetails({ order, className }: OrderDetailsProps) {
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Unknown Customer'
  const couponCount = order.coupons?.length || 0
  const createdAt = new Date(order.createdAt)
  const updatedAt = new Date(order.updatedAt)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold font-mono">#{order.orderNumber}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {format(createdAt, 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Order Number</div>
                <div className="font-medium font-mono">#{order.orderNumber}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Quantity</div>
                <div className="font-medium">{order.quantity}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Amount</div>
                <div className="font-medium text-lg">{formatCurrency(order.totalAmount)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Coupons</div>
                <div className="font-medium">{couponCount} coupon{couponCount !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Payment Method</div>
                <div className="font-medium">{order.paymentMethod || 'N/A'}</div>
              </div>
              {order.paymentReference && (
                <>
                  <div>
                    <div className="text-muted-foreground">Payment Reference</div>
                    <div className="font-medium font-mono text-xs">{order.paymentReference}</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-muted-foreground">Created At</div>
                <div className="font-medium">{format(createdAt, 'MMM dd, yyyy HH:mm')}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Updated</div>
                <div className="font-medium">{format(updatedAt, 'MMM dd, yyyy HH:mm')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.customer ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
                {order.customer.phone && (
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{order.customer.phone}</div>
                  </div>
                )}
                {order.customer.address && (
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">{order.customer.address}</div>
                    {order.customer.city && order.customer.province && (
                      <div className="text-sm text-muted-foreground">
                        {order.customer.city}, {order.customer.province}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Customer information not available</div>
            )}
          </CardContent>
        </Card>

        {/* Deal Information */}
        {order.deal && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Deal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Deal Title</div>
                  <div className="font-medium">{order.deal.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Deal Price</div>
                    <div className="font-medium">{formatCurrency(order.deal.dealPrice)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Discount Value</div>
                    <div className="font-medium">{formatCurrency(order.deal.discountPrice)}</div>
                  </div>
                </div>
                {order.deal.merchant && (
                  <div>
                    <div className="text-sm text-muted-foreground">Merchant</div>
                    <div className="font-medium">{order.deal.merchant.businessName}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Payment Method</div>
                <div className="font-medium">{order.paymentMethod || 'N/A'}</div>
              </div>
              {order.paymentReference && (
                <div>
                  <div className="text-sm text-muted-foreground">Payment Reference</div>
                  <div className="font-medium font-mono text-xs break-all">{order.paymentReference}</div>
                </div>
              )}
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="font-medium text-2xl">{formatCurrency(order.totalAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      {order.coupons && order.coupons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Coupons ({couponCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium font-mono text-sm">{coupon.id}</div>
                      <div className="text-xs text-muted-foreground">
                        Status: {coupon.status}
                      </div>
                    </div>
                  </div>
                  {coupon.usedAt && (
                    <div className="text-xs text-muted-foreground">
                      Used: {format(new Date(coupon.usedAt), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Timeline */}
      <Card>
        <CardContent className="pt-6">
          <OrderTimeline
            orderCreatedAt={order.createdAt}
            orderStatus={order.status}
          />
        </CardContent>
      </Card>
    </div>
  )
}



