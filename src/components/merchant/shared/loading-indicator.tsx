'use client'

import { cn } from '@/lib/utils'

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  fullScreen?: boolean
}

/**
 * Loading Indicator Component
 * 
 * Displays a spinning loading indicator with optional text.
 * Can be used inline or as a full-screen overlay.
 * 
 * @example
 * ```tsx
 * <LoadingIndicator size="md" text="Loading..." />
 * ```
 */
export function LoadingIndicator({
  size = 'md',
  text,
  className,
  fullScreen = false,
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {spinner}
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}

/**
 * Inline Loading Spinner
 * 
 * Compact version for inline use (e.g., in buttons)
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
    />
  )
}



