/**
 * Retry Utilities
 * 
 * Provides retry mechanisms with exponential backoff for failed operations.
 * 
 * @example
 * ```typescript
 * import { retryWithBackoff } from '@/lib/retry-utils'
 * 
 * const result = await retryWithBackoff(
 *   async () => await api.get('/endpoint'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * )
 * ```
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  retryCondition?: (error: unknown) => boolean
  onRetry?: (attempt: number, error: unknown) => void
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'retryCondition' | 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
}

/**
 * Calculate delay for exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1)
  return Math.min(delay, maxDelay)
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries,
    initialDelay = DEFAULT_RETRY_OPTIONS.initialDelay,
    maxDelay = DEFAULT_RETRY_OPTIONS.maxDelay,
    backoffMultiplier = DEFAULT_RETRY_OPTIONS.backoffMultiplier,
    retryCondition,
    onRetry,
  } = options

  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Check if we should retry
      if (retryCondition && !retryCondition(error)) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt >= maxRetries) {
        throw error
      }

      // Calculate delay
      const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier)

      // Call onRetry callback
      if (onRetry) {
        onRetry(attempt, error)
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Retry condition for network errors
 */
export function shouldRetryNetworkError(error: unknown): boolean {
  // Don't retry on client errors (4xx)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusCode = error.statusCode as number
    if (statusCode >= 400 && statusCode < 500) {
      // Don't retry on 401 (Unauthorized) or 403 (Forbidden)
      if (statusCode === 401 || statusCode === 403) {
        return false
      }
      // Don't retry on 404 (Not Found) or 422 (Validation Error)
      if (statusCode === 404 || statusCode === 422) {
        return false
      }
    }
  }

  // Retry on network errors, timeouts, and server errors (5xx)
  return true
}

/**
 * Retry condition for query retries (React Query compatible)
 */
export function shouldRetryQuery(error: unknown, failureCount: number): boolean {
  // Don't retry after 3 attempts
  if (failureCount >= 3) {
    return false
  }

  // Don't retry on client errors (4xx)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusCode = error.statusCode as number
    if (statusCode >= 400 && statusCode < 500) {
      return false
    }
  }

  // Retry on network errors, timeouts, and server errors (5xx)
  return shouldRetryNetworkError(error)
}

/**
 * Get retry delay for React Query
 */
export function getRetryDelay(failureCount: number): number {
  // Exponential backoff: 1s, 2s, 4s
  return Math.min(1000 * Math.pow(2, failureCount), 10000)
}

