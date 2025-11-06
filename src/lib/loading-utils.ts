/**
 * Loading Utilities
 * 
 * Utilities for managing loading states and preventing flickering.
 * 
 * @example
 * ```typescript
 * import { useMinimumLoadingTime } from '@/lib/loading-utils'
 * 
 * const { isMinLoading, startLoading } = useMinimumLoadingTime(300)
 * const effectiveLoading = isLoading || isMinLoading
 * ```
 */

import { useState, useEffect, useRef } from 'react'

/**
 * Hook to prevent flickering by ensuring minimum loading display time
 * 
 * @param minimumTime - Minimum time to show loading state (ms)
 * @returns Object with isMinLoading state and startLoading function
 */
export function useMinimumLoadingTime(minimumTime: number = 300) {
  const [isMinLoading, setIsMinLoading] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = () => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now()
      setIsMinLoading(true)
    }
  }

  const stopLoading = () => {
    if (startTimeRef.current !== null) {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, minimumTime - elapsed)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsMinLoading(false)
        startTimeRef.current = null
      }, remaining)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isMinLoading,
    startLoading,
    stopLoading,
  }
}

/**
 * Combine loading states with minimum display time
 * 
 * @param isLoading - Actual loading state
 * @param minimumTime - Minimum display time (ms)
 * @returns Effective loading state
 */
export function useEffectiveLoading(
  isLoading: boolean,
  minimumTime: number = 300
): boolean {
  const { isMinLoading, startLoading, stopLoading } = useMinimumLoadingTime(minimumTime)

  useEffect(() => {
    if (isLoading) {
      startLoading()
    } else {
      stopLoading()
    }
  }, [isLoading, startLoading, stopLoading])

  return isLoading || isMinLoading
}

/**
 * Get loading state text based on action
 */
export function getLoadingText(
  action: string,
  isPending: boolean
): string {
  if (!isPending) return action

  const loadingTexts: Record<string, string> = {
    create: 'Creating...',
    update: 'Updating...',
    delete: 'Deleting...',
    save: 'Saving...',
    submit: 'Submitting...',
    upload: 'Uploading...',
    publish: 'Publishing...',
    pause: 'Pausing...',
    resume: 'Resuming...',
    activate: 'Activating...',
    deactivate: 'Deactivating...',
    reset: 'Resetting...',
    export: 'Exporting...',
    process: 'Processing...',
    verify: 'Verifying...',
    load: 'Loading...',
  }

  // Try to match action with loading text
  for (const [key, value] of Object.entries(loadingTexts)) {
    if (action.toLowerCase().includes(key)) {
      return value
    }
  }

  // Default: append "..."
  return `${action}...`
}

