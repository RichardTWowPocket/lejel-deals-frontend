'use client'

import { RedemptionResponse } from '@/types/redemption'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { Eye, User, ShoppingBag, Ticket } from 'lucide-react'
import { RedemptionStatus } from '@/types/redemption'
import { cn } from '@/lib/utils'

interface RedemptionRowProps {
  redemption: RedemptionResponse
  onViewDetails?: (redemption: RedemptionResponse) => void
  className?: string
  variant?: 'table' | 'card'
}

export function RedemptionRow({ redemption, onViewDetails, className, variant = 'table' }: RedemptionRowProps) {
  const redeemedAt = new Date(redemption.redeemedAt)
  const customerName = `${redemption.customer?.firstName || ''} ${redemption.customer?.lastName || ''}`.trim() || 'Unknown Customer'

  const getStatusBadge = (status: RedemptionStatus) => {
    switch (status) {
      case RedemptionStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>
      case RedemptionStatus.PENDING:
        return <Badge variant="warning">Pending</Badge>
      case RedemptionStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render table row for desktop
  if (variant === 'table') {
    return (
      <TableRow className={className}>
        {/* Date/Time */}
        <TableCell className="w-[150px]">
          <div className="text-sm font-medium">
            {format(redeemedAt, 'MMM dd, yyyy')}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(redeemedAt, 'HH:mm')}
          </div>
        </TableCell>

        {/* Customer */}
        <TableCell className="w-[200px]">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{customerName}</div>
              <div className="text-xs text-muted-foreground">
                {redemption.customer?.email}
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
                {redemption.deal?.title || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(redemption.deal?.discountPrice || 0)}
              </div>
            </div>
          </div>
        </TableCell>

        {/* Order */}
        <TableCell className="w-[150px]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium">
              #{redemption.order?.orderNumber || 'N/A'}
            </div>
          </div>
        </TableCell>

        {/* Status */}
        <TableCell className="w-[120px]">
          {getStatusBadge(redemption.status)}
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right w-[80px]">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(redemption)}
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
          <div className="text-sm font-medium">
            {format(redeemedAt, 'MMM dd, yyyy HH:mm')}
          </div>
          <div className="text-xs text-muted-foreground">
            Order #{redemption.order?.orderNumber || 'N/A'}
          </div>
        </div>
        {getStatusBadge(redemption.status)}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{customerName}</div>
            <div className="text-xs text-muted-foreground">
              {redemption.customer?.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {redemption.deal?.title || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(redemption.deal?.discountPrice || 0)}
            </div>
          </div>
        </div>
      </div>

      {onViewDetails && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(redemption)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      )}
    </div>
  )
}
