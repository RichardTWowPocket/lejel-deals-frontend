'use client'

import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/lib/constants'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
  let text: string

  switch (status) {
    case OrderStatus.PENDING:
      variant = 'warning'
      text = 'Pending'
      break
    case OrderStatus.PAID:
      variant = 'success'
      text = 'Paid'
      break
    case OrderStatus.CANCELLED:
      variant = 'destructive'
      text = 'Cancelled'
      break
    case OrderStatus.REFUNDED:
      variant = 'secondary'
      text = 'Refunded'
      break
    default:
      variant = 'outline'
      text = status
  }

  return <Badge variant={variant}>{text}</Badge>
}



