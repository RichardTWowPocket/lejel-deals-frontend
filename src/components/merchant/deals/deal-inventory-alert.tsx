'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Package } from 'lucide-react'
import type { Deal } from '@/types/deal'

interface DealInventoryAlertProps {
  deal: Deal
  threshold?: number // Percentage threshold (default: 20%)
}

/**
 * Deal Inventory Alert Component
 * 
 * Shows warning when deal inventory is low.
 * 
 * @example
 * ```tsx
 * <DealInventoryAlert deal={deal} threshold={20} />
 * ```
 */
export function DealInventoryAlert({
  deal,
  threshold = 20,
}: DealInventoryAlertProps) {
  // Skip if no quantity tracking
  if (!deal.maxQuantity || deal.maxQuantity === 0) {
    return null
  }

  const remaining = deal.quantityAvailable ?? deal.maxQuantity
  const percentageLeft = (remaining / deal.maxQuantity) * 100
  const isLow = percentageLeft <= threshold

  if (!isLow) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        Low Inventory
      </AlertTitle>
      <AlertDescription>
        Only {remaining} of {deal.maxQuantity} remaining (
        {percentageLeft.toFixed(0)}% left). Consider adding more inventory or
        pausing this deal.
      </AlertDescription>
    </Alert>
  )
}



