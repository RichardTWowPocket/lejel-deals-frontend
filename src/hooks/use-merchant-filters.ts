'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

/**
 * Base filter interface
 * All merchant filter types should extend this
 */
export interface BaseFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Generic filter options for the hook
 */
export interface UseMerchantFiltersOptions<T extends BaseFilters> {
  defaults?: Partial<T>
  resetPageOnChange?: boolean
}

/**
 * Merchant Filters Hook
 * 
 * Manages filter state in URL search params for shareable, bookmarkable filters.
 * Automatically syncs with URL and handles pagination reset on filter changes.
 * 
 * @example
 * ```tsx
 * // In a component
 * const { filters, updateFilters, resetFilters } = useMerchantFilters<DealFilters>({
 *   defaults: { page: 1, limit: 10, status: 'ACTIVE' }
 * })
 * 
 * // Update filters
 * updateFilters({ status: 'PAUSED', page: 1 })
 * 
 * // Reset to defaults
 * resetFilters()
 * ```
 */
export function useMerchantFilters<T extends BaseFilters = BaseFilters>(
  options: UseMerchantFiltersOptions<T> = {}
): {
  filters: T
  updateFilters: (newFilters: Partial<T>) => void
  resetFilters: () => void
  clearFilters: () => void
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { defaults = {}, resetPageOnChange = true } = options

  // Memoize defaults to prevent unnecessary recalculations
  // Only recreate if the defaults object reference changes
  // Note: This assumes defaults are memoized at the call site
  const memoizedDefaults = useMemo(() => {
    return defaults
  }, [defaults])

  // Get current filters from URL
  const filters = useMemo(() => {
    const result: any = { ...memoizedDefaults }

    // Parse all search params
    searchParams.forEach((value, key) => {
      // Handle number fields
      if (key === 'page' || key === 'limit') {
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          result[key] = numValue
        }
      }
      // Handle boolean fields
      else if (value === 'true' || value === 'false') {
        result[key] = value === 'true'
      }
      // Handle sortOrder specifically
      else if (key === 'sortOrder' && (value === 'asc' || value === 'desc')) {
        result[key] = value
      }
      // Handle all other string fields
      else {
        result[key] = value
      }
    })

    // Apply defaults for missing values
    Object.entries(memoizedDefaults).forEach(([key, defaultValue]) => {
      if (result[key] === undefined || result[key] === null || result[key] === '') {
        result[key] = defaultValue
      }
    })

    // Ensure page and limit are numbers with defaults
    result.page = result.page || 1
    result.limit = result.limit || 10

    return result as T
  }, [searchParams, memoizedDefaults])

  // Update filters in URL
  const updateFilters = useCallback(
    (newFilters: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update all provided filters
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      // Reset to page 1 when filters change (unless page is explicitly set)
      if (
        resetPageOnChange &&
        !newFilters.page &&
        Object.keys(newFilters).some((k) => k !== 'page')
      ) {
        params.set('page', '1')
      }

      // Update URL without scroll
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams, resetPageOnChange]
  )

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams()

    // Set all default values
    Object.entries(defaults).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      }
    })

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, defaults])

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return {
    filters,
    updateFilters,
    resetFilters,
    clearFilters,
  }
}

/**
 * Hook for pagination only
 * Simplified version for pages that only need pagination
 */
export function usePagination(
  defaultPage: number = 1,
  defaultLimit: number = 10
) {
  const { filters, updateFilters } = useMerchantFilters({
    defaults: { page: defaultPage, limit: defaultLimit },
    resetPageOnChange: false,
  })

  return {
    page: filters.page || defaultPage,
    limit: filters.limit || defaultLimit,
    setPage: (page: number) => updateFilters({ page } as any),
    setLimit: (limit: number) => updateFilters({ limit, page: 1 } as any),
  }
}


