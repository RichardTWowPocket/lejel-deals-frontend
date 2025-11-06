'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

/**
 * Empty State Component
 * 
 * Displays an empty state when there's no data to show.
 * Supports icons, actions, and multiple variants.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Package}
 *   title="No deals found"
 *   description="Create your first deal to get started"
 *   action={{
 *     label: "Create Deal",
 *     onClick: () => router.push('/merchant/deals/new')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn('text-center py-8', className)}>
        {Icon && <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />}
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('border-dashed border-2 border-border/50 bg-muted/20', className)}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          {Icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          )}
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mb-4 max-w-md text-sm text-muted-foreground">{description}</p>
          )}
          {action && (
            <Button
              variant={action.variant || 'default'}
              size="sm"
              onClick={action.onClick}
              className="min-w-[120px]"
            >
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn('border-dashed border-2 border-border/50 bg-muted/20', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {Icon && (
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        )}
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        {description && (
          <p className="mb-6 max-w-md text-muted-foreground">{description}</p>
        )}
        {(action || secondaryAction) && (
          <div className="flex gap-3">
            {action && (
              <Button
                variant={action.variant || 'default'}
                size="lg"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                size="lg"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Inline Empty State
 * 
 * Compact version for inline use (e.g., in tables)
 */
export function InlineEmptyState({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div className={cn('text-center py-8 text-sm text-muted-foreground', className)}>
      {message}
    </div>
  )
}



