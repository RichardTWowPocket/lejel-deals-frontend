'use client'

import { Order } from '@/types/order'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { Eye, User, ShoppingBag, Ticket } from 'lucide-react'
import { OrderStatusBadge } from './order-status-badge'
import { cn } from '@/lib/utils'

interface OrderRowProps {
  order: Order
  onViewDetails?: (order: Order) => void
  className?: string
  variant?: 'table' | 'card'
}

export function OrderRow({ order, onViewDetails, className, variant = 'table' }: OrderRowProps) {
  const createdAt = new Date(order.createdAt)
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Unknown Customer'
  const couponCount = order.coupons?.length || 0

  // Render table row for desktop
  if (variant === 'table') {
    return (
      <TableRow className={className}>
        {/* Date */}
        <TableCell className="w-[150px]">
          <div className="text-sm font-medium">
            {format(createdAt, 'MMM dd, yyyy')}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(createdAt, 'HH:mm')}
          </div>
        </TableCell>

        {/* Order Number */}
        <TableCell className="w-[150px]">
          <div className="text-sm font-medium font-mono">
            #{order.orderNumber}
          </div>
        </TableCell>

        {/* Customer */}
        <TableCell className="w-[200px]">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{customerName}</div>
              <div className="text-xs text-muted-foreground">
                {order.customer?.email}
              </div>
            </div>
          </div>
        </TableCell>

        {/* Deal */}
        <TableCell>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium truncate">
                {order.deal?.title || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                Qty: {order.quantity}
              </div>
            </div>
          </div>
        </TableCell>

        {/* Amount */}
        <TableCell className="w-[120px]">
          <div className="text-sm font-medium">
            {formatCurrency(order.totalAmount)}
          </div>
        </TableCell>

        {/* Coupons */}
        <TableCell className="w-[100px]">
          <div className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{couponCount}</span>
          </div>
        </TableCell>

        {/* Status */}
        <TableCell className="w-[120px]">
          <OrderStatusBadge status={order.status} />
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right w-[80px]">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  // Render card view for mobile
  return (
    <div className={cn('p-4 space-y-3 border-b last:border-0', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium font-mono">
            #{order.orderNumber}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(createdAt, 'MMM dd, yyyy HH:mm')}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{customerName}</div>
            <div className="text-xs text-muted-foreground">
              {order.customer?.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {order.deal?.title || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Qty: {order.quantity} • {formatCurrency(order.totalAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {couponCount} coupon{couponCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {onViewDetails && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      )}
    </div>
  )
}


