import { Deal, DealStatus } from '@/types/deal'

/**
 * Check if a deal is currently active
 */
export function isDealActive(deal: Deal): boolean {
  if (deal.status !== DealStatus.ACTIVE) {
    return false
  }

  const now = new Date()
  const validFrom = new Date(deal.validFrom)
  const validUntil = new Date(deal.validUntil)

  return validFrom <= now && now <= validUntil
}

/**
 * Calculate savings amount in IDR
 */
export function calculateSavingsAmount(deal: Deal): number {
  return deal.discountPrice - deal.dealPrice
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercentage(deal: Deal): number {
  if (deal.discountPrice === 0) return 0
  return Math.floor(((deal.discountPrice - deal.dealPrice) / deal.discountPrice) * 100)
}

/**
 * Calculate remaining inventory
 */
export function calculateInventoryLeft(deal: Deal): number | null {
  if (!deal.maxQuantity) return null
  return deal.maxQuantity - deal.soldQuantity
}

/**
 * Calculate progress percentage (sold / max)
 */
export function calculateProgressPercentage(deal: Deal): number | null {
  if (!deal.maxQuantity || deal.maxQuantity === 0) return null
  return Math.floor((deal.soldQuantity / deal.maxQuantity) * 100)
}

/**
 * Calculate time remaining until deal ends
 * Returns in seconds
 */
export function calculateTimeToEnd(deal: Deal, timeOffset: number = 0): number {
  const now = new Date().getTime() + timeOffset
  const validUntil = new Date(deal.validUntil).getTime()
  const diff = validUntil - now
  return Math.floor(diff / 1000) // Return in seconds
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 0) return 'Expired'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`
  } else if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  } else {
    return `0:${secs.toString().padStart(2, '0')}`
  }
}

/**
 * Get deal urgency level based on time remaining
 */
export type UrgencyLevel = 'normal' | 'ending-soon' | 'urgent' | 'expired'

export function getDealUrgency(deal: Deal, timeOffset: number = 0): UrgencyLevel {
  const secondsRemaining = calculateTimeToEnd(deal, timeOffset)
  
  if (secondsRemaining < 0) return 'expired'
  if (secondsRemaining < 3600) return 'urgent' // < 1 hour
  if (secondsRemaining < 86400) return 'ending-soon' // < 24 hours
  return 'normal'
}

/**
 * Check if deal has low inventory
 */
export function hasLowInventory(deal: Deal): boolean {
  const inventoryLeft = calculateInventoryLeft(deal)
  return inventoryLeft !== null && inventoryLeft < 10 && inventoryLeft > 0
}

/**
 * Get countdown chip color based on urgency
 */
export function getCountdownColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'urgent':
      return 'text-destructive bg-destructive/10 border-destructive/20'
    case 'ending-soon':
      return 'text-warning bg-warning/10 border-warning/20'
    case 'expired':
      return 'text-muted-foreground bg-muted border-border'
    default:
      return 'text-success bg-success/10 border-success/20'
  }
}

/**
 * Format "X bought today" message
 */
export function formatBoughtToday(count: number | undefined): string {
  if (!count || count === 0) return ''
  return `${count} bought today`
}

/**
 * Get deal state badge info
 */
export type DealStateBadge = {
  text: string
  variant: 'default' | 'destructive' | 'secondary' | 'warning' | 'outline'
  className?: string
}

export function getDealStateBadge(deal: Deal): DealStateBadge | null {
  if (!isDealActive(deal)) {
    switch (deal.status) {
      case DealStatus.SOLD_OUT:
        return {
          text: 'SOLD OUT',
          variant: 'destructive',
          className: 'animate-pulse-slow',
        }
      case DealStatus.EXPIRED:
        return {
          text: 'EXPIRED',
          variant: 'secondary',
        }
      case DealStatus.PAUSED:
        return {
          text: 'PAUSED',
          variant: 'outline',
        }
      default:
        return null
    }
  }
  return null
}

/**
 * Check if deal should show progress bar
 */
export function shouldShowProgressBar(deal: Deal): boolean {
  const inventoryLeft = calculateInventoryLeft(deal)
  return inventoryLeft !== null && deal.maxQuantity !== null && deal.maxQuantity > 0
}

/**
 * Get all derived fields for a deal
 */
export interface DealDerivedFields {
  isActive: boolean
  savingsAmount: number
  savingsPercentage: number
  inventoryLeft: number | null
  progressPercentage: number | null
  timeToEnd: number
  timeRemainingFormatted: string
  urgency: UrgencyLevel
  hasLowInventory: boolean
  countdownColor: string
  boughtToday: string
  stateBadge: DealStateBadge | null
  shouldShowProgressBar: boolean
}

export function getDealDerivedFields(deal: Deal, timeOffset: number = 0): DealDerivedFields {
  const savingsAmount = calculateSavingsAmount(deal)
  const savingsPercentage = calculateSavingsPercentage(deal)
  const inventoryLeft = calculateInventoryLeft(deal)
  const progressPercentage = calculateProgressPercentage(deal)
  const timeToEnd = calculateTimeToEnd(deal, timeOffset)
  const urgency = getDealUrgency(deal, timeOffset)
  const countdownColor = getCountdownColor(urgency)

  return {
    isActive: isDealActive(deal),
    savingsAmount,
    savingsPercentage,
    inventoryLeft,
    progressPercentage,
    timeToEnd,
    timeRemainingFormatted: formatTimeRemaining(timeToEnd),
    urgency,
    hasLowInventory: hasLowInventory(deal),
    countdownColor,
    boughtToday: formatBoughtToday(deal._count?.orders),
    stateBadge: getDealStateBadge(deal),
    shouldShowProgressBar: shouldShowProgressBar(deal),
  }
}

