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
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Paid'
        }
      case 'PENDING':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Pending'
        }
      case 'CANCELLED':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          label: 'Cancelled'
        }
      case 'REFUNDED':
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Refunded'
        }
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  )
}
