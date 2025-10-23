import { format, formatDistanceToNow, differenceInDays, isPast, isFuture } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  return format(new Date(date), formatStr, { locale: id })
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: string | Date,
  formatStr: string = 'dd MMM yyyy, HH:mm',
): string {
  return format(new Date(date), formatStr, { locale: id })
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })
}

/**
 * Check if date is expired
 */
export function isExpired(date: string | Date): boolean {
  return isPast(new Date(date))
}

/**
 * Check if date is upcoming
 */
export function isUpcoming(date: string | Date): boolean {
  return isFuture(new Date(date))
}

/**
 * Get days remaining
 */
export function getDaysRemaining(date: string | Date): number {
  const days = differenceInDays(new Date(date), new Date())
  return days < 0 ? 0 : days
}

/**
 * Get time remaining in object format
 */
export function getTimeRemaining(date: string | Date) {
  const now = new Date().getTime()
  const end = new Date(date).getTime()
  const distance = end - now

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    isExpired: false,
  }
}

