import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/types/common'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PAID':
        return {
          variant: 'success' as const,
          className: '',
          label: 'Paid'
        }
      case 'PENDING':
        return {
          variant: 'warning' as const,
          className: '',
          label: 'Pending'
        }
      case 'CANCELLED':
        return {
          variant: 'destructive' as const,
          className: '',
          label: 'Cancelled'
        }
      case 'REFUNDED':
        return {
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground',
          label: 'Refunded'
        }
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge 
      variant={config.variant}
      className={config.className ? `${config.className} ${className || ''}` : className || ''}
    >
      {config.label}
    </Badge>
  )
}
