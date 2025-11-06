/**
 * Error Logger Utility
 * 
 * Structured error logging for debugging and monitoring.
 * Provides consistent error logging format and optional error tracking service integration.
 * 
 * @example
 * ```typescript
 * import { logError } from '@/lib/error-logger'
 * 
 * logError(error, {
 *   context: 'fetchMerchantDeals',
 *   userId: user?.id,
 *   additionalData: { filters }
 * })
 * ```
 */

export interface ErrorLogContext {
  context?: string
  userId?: string
  merchantId?: string
  action?: string
  resource?: string
  additionalData?: Record<string, unknown>
  userAgent?: string
  url?: string
}

export interface ErrorLogEntry {
  timestamp: string
  error: {
    message: string
    code?: string
    stack?: string
    statusCode?: number
    validationErrors?: Record<string, string[]>
  }
  context: ErrorLogContext
  environment: {
    userAgent: string
    url: string
    timestamp: string
  }
}

/**
 * Log error with structured format
 */
export function logError(error: unknown, context?: ErrorLogContext): void {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  // Get error code and status if it's an API error
  let errorCode: string | undefined
  let statusCode: number | undefined
  let validationErrors: Record<string, string[]> | undefined

  if (error && typeof error === 'object') {
    if ('statusCode' in error) {
      statusCode = error.statusCode as number
    }
    if ('code' in error) {
      errorCode = String(error.code)
    }
    if ('errors' in error) {
      validationErrors = error.errors as Record<string, string[]>
    }
  }

  const logEntry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    error: {
      message: errorMessage,
      code: errorCode,
      stack: errorStack,
      statusCode,
      validationErrors,
    },
    context: {
      ...context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    },
    environment: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date().toISOString(),
    },
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 [${context?.context || 'ERROR'}] ${errorMessage}`)
    console.error('Error Details:', error)
    console.log('Context:', context)
    console.log('Full Log Entry:', logEntry)
    console.groupEnd()
  } else {
    // Production logging (can be extended to send to error tracking service)
    console.error('[ERROR]', JSON.stringify(logEntry, null, 2))
  }

  // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: { custom: context },
  //     tags: { action: context?.action, resource: context?.resource },
  //   })
  // }
}

/**
 * Log error with user-friendly message
 */
export function logErrorWithMessage(
  error: unknown,
  userMessage: string,
  context?: ErrorLogContext
): void {
  logError(error, {
    ...context,
    additionalData: {
      ...context?.additionalData,
      userMessage,
    },
  })
}

/**
 * Log validation errors specifically
 */
export function logValidationError(
  errors: Record<string, string[]>,
  context?: ErrorLogContext
): void {
  logError(
    new Error('Validation failed'),
    {
      ...context,
      additionalData: {
        ...context?.additionalData,
        validationErrors: errors,
      },
    }
  )
}

/**
 * Log network errors with retry information
 */
export function logNetworkError(
  error: unknown,
  retryCount: number,
  context?: ErrorLogContext
): void {
  logError(error, {
    ...context,
    additionalData: {
      ...context?.additionalData,
      retryCount,
      isNetworkError: true,
    },
  })
}

