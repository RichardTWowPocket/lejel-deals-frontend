'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  CreditCard,
  ShoppingBag,
  FileText,
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react'

interface ActivityEvent {
  id: string
  type: 'order_placed' | 'payment_pending' | 'payment_confirmed' | 'coupons_generated' | 'coupon_used' | 'coupon_expired' | 'refund_requested' | 'refund_processed' | 'order_cancelled'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  metadata?: {
    amount?: number
    paymentMethod?: string
    couponCount?: number
    staffName?: string
    location?: string
  }
}

interface ActivityTimelineProps {
  orderId: string
  activities?: ActivityEvent[]
}

export function ActivityTimeline({ orderId, activities }: ActivityTimelineProps) {
  // Mock activities - replace with actual API call
  const mockActivities: ActivityEvent[] = [
    {
      id: '1',
      type: 'order_placed',
      title: 'Order Placed',
      description: 'Order was successfully placed and is being processed',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
      metadata: {
        amount: 150000
      }
    },
    {
      id: '2',
      type: 'payment_pending',
      title: 'Payment Pending',
      description: 'Waiting for payment confirmation',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
      metadata: {
        paymentMethod: 'bca_va'
      }
    },
    {
      id: '3',
      type: 'payment_confirmed',
      title: 'Payment Confirmed',
      description: 'Payment has been successfully confirmed',
      timestamp: '2024-01-15T10:35:00Z',
      status: 'completed',
      metadata: {
        amount: 150000,
        paymentMethod: 'bca_va'
      }
    },
    {
      id: '4',
      type: 'coupons_generated',
      title: 'Coupons Generated',
      description: 'Digital coupons have been generated and are ready for use',
      timestamp: '2024-01-15T10:36:00Z',
      status: 'completed',
      metadata: {
        couponCount: 2
      }
    },
    {
      id: '5',
      type: 'coupon_used',
      title: 'Coupon Used',
      description: 'One coupon has been successfully redeemed',
      timestamp: '2024-01-20T14:30:00Z',
      status: 'completed',
      metadata: {
        staffName: 'Siti (Cashier)',
        location: 'Pungbu BBQ - Setiabudi'
      }
    }
  ]

  const displayActivities = activities || mockActivities

  const getActivityIcon = (type: string, status: string) => {
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
      case 'coupon_expired':
        return <XCircle {...iconProps} />
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

  const getActivityColor = (status: string) => {
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

  const getActivityBgColor = (status: string) => {
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {displayActivities.map((activity, index) => (
            <div key={activity.id} className='flex items-start gap-4'>
              {/* Timeline Icon */}
              <div className={`flex-shrink-0 p-2 rounded-full ${getActivityBgColor(activity.status)}`}>
                <div className={getActivityColor(activity.status)}>
                  {getActivityIcon(activity.type, activity.status)}
                </div>
              </div>

              {/* Timeline Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h4 className='font-medium text-sm'>{activity.title}</h4>
                  <div className='flex items-center gap-2'>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className='text-xs'
                    >
                      {activity.status}
                    </Badge>
                    <span className='text-xs text-muted-foreground'>
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p className='text-sm text-muted-foreground mb-2'>
                  {activity.description}
                </p>

                {/* Metadata */}
                {activity.metadata && (
                  <div className='text-xs text-muted-foreground space-y-1'>
                    {activity.metadata.amount && (
                      <p>Amount: Rp {activity.metadata.amount.toLocaleString('id-ID')}</p>
                    )}
                    {activity.metadata.paymentMethod && (
                      <p>Payment Method: {activity.metadata.paymentMethod}</p>
                    )}
                    {activity.metadata.couponCount && (
                      <p>Coupons Generated: {activity.metadata.couponCount}</p>
                    )}
                    {activity.metadata.staffName && (
                      <p>Staff: {activity.metadata.staffName}</p>
                    )}
                    {activity.metadata.location && (
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3' />
                        <span>{activity.metadata.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Timestamp Tooltip */}
                <p className='text-xs text-muted-foreground mt-2'>
                  {formatFullTimestamp(activity.timestamp)}
                </p>
              </div>

              {/* Timeline Line */}
              {index < displayActivities.length - 1 && (
                <div className='absolute left-6 top-12 w-0.5 h-8 bg-border' />
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayActivities.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>
            <Clock className='h-12 w-12 mx-auto mb-4 opacity-50' />
            <p>No activity recorded yet</p>
            <p className='text-sm'>Activity will appear here as your order progresses</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
