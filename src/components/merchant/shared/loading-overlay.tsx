'use client'

import { LoadingIndicator } from './loading-indicator'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  className?: string
  variant?: 'spinner' | 'skeleton'
}

/**
 * Loading Overlay Component
 * 
 * Shows a subtle loading indicator overlay for background refetches.
 * Use this when data is already loaded but being refreshed.
 * 
 * @example
 * ```tsx
 * <LoadingOverlay isLoading={isFetching && !isLoading} text="Refreshing..." />
 * ```
 */
export function LoadingOverlay({
  isLoading,
  text,
  className,
  variant = 'spinner',
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm transition-opacity',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {variant === 'spinner' ? (
          <LoadingIndicator size="md" text={text} />
        ) : (
          <div className="space-y-2">
            <div className="h-2 w-32 bg-muted animate-pulse rounded" />
            <div className="h-2 w-24 bg-muted animate-pulse rounded mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Inline Loading Badge
 * 
 * Small loading indicator for inline use (e.g., in table rows)
 */
export function InlineLoadingBadge({ text }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {text && <span>{text}</span>}
    </div>
  )
}

