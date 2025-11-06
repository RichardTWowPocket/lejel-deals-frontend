'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { User, ShoppingBag, Calendar } from 'lucide-react'
import { PayoutResponse } from '@/types/payout'
import { OrderStatusBadge } from '@/components/merchant/orders/order-status-badge'
import { OrderStatus } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PayoutTableProps {
  orders: PayoutResponse['orders']
  summary: PayoutResponse['summary']
  className?: string
}

export function PayoutTable({ orders, summary, className }: PayoutTableProps) {
  // Ensure orders is always an array
  const ordersArray = Array.isArray(orders) ? orders : []
  
  if (ordersArray.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No orders found for this period</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-0">
        {/* Date Range Info */}
        <div className="p-4 border-b flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(summary.startDate), 'MMM dd, yyyy')} -{' '}
            {format(new Date(summary.endDate), 'MMM dd, yyyy')}
          </span>
          <span className="mx-2">•</span>
          <span>{summary.totalRecords} total orders</span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="w-[150px]">Order Number</TableHead>
                <TableHead className="w-[200px]">Customer</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersArray.map((order) => {
                const customerName = order.customer
                  ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Unknown'
                  : 'Unknown Customer'
                const createdAt = new Date(order.createdAt)

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {format(createdAt, 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(createdAt, 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium font-mono">
                        #{order.orderNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{customerName}</div>
                          {order.customer?.email && (
                            <div className="text-xs text-muted-foreground">
                              {order.customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {order.deal?.title || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {ordersArray.map((order) => {
            const customerName = order.customer
              ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Unknown'
              : 'Unknown Customer'
            const createdAt = new Date(order.createdAt)

            return (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium font-mono">
                      #{order.orderNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(createdAt, 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{customerName}</div>
                      {order.customer?.email && (
                        <div className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      {order.deal?.title || 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}



