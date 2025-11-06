'use client'

import { OrderTimelineEvent } from '@/types/order'
import { Clock, CheckCircle, XCircle, ShoppingBag, CreditCard, FileText, RefreshCw, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
  events?: OrderTimelineEvent[]
  orderCreatedAt: string
  orderStatus: string
  className?: string
}

export function OrderTimeline({ events, orderCreatedAt, orderStatus, className }: OrderTimelineProps) {
  // Generate default timeline from order data if events not provided
  const defaultEvents: OrderTimelineEvent[] = [
    {
      id: 'order_placed',
      type: 'order_placed',
      title: 'Order Placed',
      description: 'Order was successfully placed',
      timestamp: orderCreatedAt,
      status: 'completed',
    },
    {
      id: 'payment_pending',
      type: 'payment_pending',
      title: 'Payment Pending',
      description: 'Waiting for payment confirmation',
      timestamp: orderCreatedAt,
      status: orderStatus === 'PENDING' ? 'pending' : orderStatus === 'PAID' ? 'completed' : 'cancelled',
    },
    {
      id: 'payment_confirmed',
      type: 'payment_confirmed',
      title: 'Payment Confirmed',
      description: 'Payment has been confirmed',
      timestamp: orderCreatedAt,
      status: orderStatus === 'PAID' ? 'completed' : 'pending',
    },
    {
      id: 'coupons_generated',
      type: 'coupons_generated',
      title: 'Coupons Generated',
      description: 'Coupons have been generated for this order',
      timestamp: orderCreatedAt,
      status: orderStatus === 'PAID' ? 'completed' : 'pending',
    },
  ]

  const displayEvents = events || defaultEvents

  const getEventIcon = (type: string) => {
    const iconProps = { className: 'h-5 w-5' }
    
    switch (type) {
      case 'order_placed':
        return <ShoppingBag {...iconProps} />
      case 'payment_pending':
        return <Clock {...iconProps} />
      case 'payment_confirmed':
        return <CreditCard {...iconProps} />
      case 'coupons_generated':
        return <FileText {...iconProps} />
      case 'coupon_used':
        return <CheckCircle {...iconProps} />
      case 'refund_requested':
        return <RefreshCw {...iconProps} />
      case 'refund_processed':
        return <CheckCircle {...iconProps} />
      case 'order_cancelled':
        return <XCircle {...iconProps} />
      default:
        return <AlertCircle {...iconProps} />
    }
  }

  const getEventColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getEventBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30'
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30'
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-900/30'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">Order Timeline</h3>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline Events */}
        <div className="space-y-6">
          {displayEvents.map((event, index) => {
            const isLast = index === displayEvents.length - 1
            const isCompleted = event.status === 'completed'
            
            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background',
                    isCompleted
                      ? 'bg-green-600 dark:bg-green-400'
                      : event.status === 'pending'
                      ? 'bg-yellow-600 dark:bg-yellow-400'
                      : 'bg-gray-400 dark:bg-gray-600'
                  )}
                >
                  <div className="text-white dark:text-black">
                    {getEventIcon(event.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            getEventBgColor(event.status),
                            getEventColor(event.status)
                          )}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      {event.metadata && (
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {event.metadata.amount && (
                            <div>Amount: {event.metadata.amount}</div>
                          )}
                          {event.metadata.paymentMethod && (
                            <div>Payment: {event.metadata.paymentMethod}</div>
                          )}
                          {event.metadata.couponCount !== undefined && (
                            <div>Coupons: {event.metadata.couponCount}</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

