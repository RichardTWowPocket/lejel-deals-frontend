'use client'

import { Badge } from '@/components/ui/badge'
import { DealStatus } from '@/types/deal'
import { cn } from '@/lib/utils'

interface DealStatusBadgeProps {
  status: DealStatus
  className?: string
}

/**
 * Deal Status Badge Component
 * 
 * Displays deal status with appropriate color and styling.
 * 
 * @example
 * ```tsx
 * <DealStatusBadge status={DealStatus.ACTIVE} />
 * ```
 */
export function DealStatusBadge({ status, className }: DealStatusBadgeProps) {
  const statusConfig = {
    [DealStatus.ACTIVE]: {
      label: 'Active',
      variant: 'success' as const,
    },
    [DealStatus.PAUSED]: {
      label: 'Paused',
      variant: 'warning' as const,
    },
    [DealStatus.DRAFT]: {
      label: 'Draft',
      variant: 'outline' as const,
    },
    [DealStatus.EXPIRED]: {
      label: 'Expired',
      variant: 'secondary' as const,
    },
    [DealStatus.SOLD_OUT]: {
      label: 'Sold Out',
      variant: 'destructive' as const,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  )
}



