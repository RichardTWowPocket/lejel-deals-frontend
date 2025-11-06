'use client'

import { AlertTriangle, RefreshCw, WifiOff, Clock, Shield, FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  getErrorCode,
  ERROR_CODES,
} from '@/lib/api-error'
import {
  getErrorTitle,
  getErrorDescription,
} from '@/lib/error-handler'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void | Promise<void>
  title?: string
  description?: string
  className?: string
  variant?: 'default' | 'compact'
  showRetryButton?: boolean
  retryLabel?: string
}

/**
 * Error Display Component
 * 
 * Displays user-friendly error messages with appropriate styling
 * based on error type. Supports retry functionality.
 * 
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={error}
 *   onRetry={() => refetch()}
 *   title="Failed to load deals"
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  onRetry,
  title,
  description,
  className,
  variant = 'default',
  showRetryButton = true,
  retryLabel = 'Coba Lagi',
}: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false)
  const errorCode = getErrorCode(error)
  const errorTitle = title || getErrorTitle(error)
  const errorDescription = description || getErrorDescription(error)

  const handleRetry = async () => {
    if (!onRetry) return

    setIsRetrying(true)
    try {
      await onRetry()
    } catch (retryError) {
      // Error will be handled by the component that called retry
      console.error('Retry failed:', retryError)
    } finally {
      setIsRetrying(false)
    }
  }

  // Get icon based on error type
  const getErrorIcon = () => {
    switch (errorCode) {
      case ERROR_CODES.NETWORK_ERROR:
        return <WifiOff className="h-8 w-8 text-destructive" />
      case ERROR_CODES.TIMEOUT:
        return <Clock className="h-8 w-8 text-destructive" />
      case ERROR_CODES.FORBIDDEN:
      case ERROR_CODES.UNAUTHORIZED:
        return <Shield className="h-8 w-8 text-destructive" />
      case ERROR_CODES.NOT_FOUND:
        return <FileX className="h-8 w-8 text-destructive" />
      default:
        return <AlertTriangle className="h-8 w-8 text-destructive" />
    }
  }

  // Custom messages based on error code
  const errorMessages: Record<string, { title: string; description: string }> =
    {
      [ERROR_CODES.NETWORK_ERROR]: {
        title: 'Network Error',
        description:
          'Unable to connect to server. Please check your internet connection.',
      },
      [ERROR_CODES.UNAUTHORIZED]: {
        title: 'Unauthorized',
        description: 'Your session has expired. Please log in again.',
      },
      [ERROR_CODES.FORBIDDEN]: {
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
      },
      [ERROR_CODES.NOT_FOUND]: {
        title: 'Not Found',
        description: 'The requested resource was not found.',
      },
      [ERROR_CODES.VALIDATION_ERROR]: {
        title: 'Validation Error',
        description: errorDescription,
      },
      [ERROR_CODES.SERVER_ERROR]: {
        title: 'Server Error',
        description:
          'An error occurred on the server. Please try again later.',
      },
      [ERROR_CODES.TIMEOUT]: {
        title: 'Request Timeout',
        description:
          'The request took too long to complete. Please try again.',
      },
      [ERROR_CODES.UNKNOWN]: {
        title: errorTitle,
        description: errorDescription,
      },
    }

  const errorInfo =
    errorMessages[errorCode] || {
      title: errorTitle,
      description: errorDescription,
    }

  if (variant === 'compact') {
    return (
      <Alert variant="destructive" className={cn('mb-4', className)}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-sm">{errorInfo.title}</AlertTitle>
        <AlertDescription className="text-xs">
          {errorInfo.description}
        </AlertDescription>
        {showRetryButton && onRetry && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="h-8"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                  Mencoba...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  {retryLabel}
                </>
              )}
            </Button>
          </div>
        )}
      </Alert>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        {getErrorIcon()}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-destructive">
        {errorInfo.title}
      </h3>

      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {errorInfo.description}
      </p>

      {showRetryButton && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={isRetrying}
          className="min-w-[120px]"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Mencoba...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {retryLabel}
            </>
          )}
        </Button>
      )}
    </div>
  )
}

/**
 * Inline Error Display
 * 
 * Compact version for inline error display (e.g., in forms)
 */
export function InlineErrorDisplay({
  error,
  className,
}: {
  error: unknown
  className?: string
}) {
  const description = getErrorDescription(error)

  return (
    <Alert variant="destructive" className={cn('mt-2', className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-sm">{description}</AlertDescription>
    </Alert>
  )
}



