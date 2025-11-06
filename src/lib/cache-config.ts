/**
 * Cache Configuration Constants
 * 
 * Centralized cache configuration for React Query.
 * Provides consistent stale times and cache times per resource type.
 * 
 * Based on recommendations from MERCHANT_DASHBOARD_DATA_FETCHING_PATTERNS.md
 * 
 * @example
 * ```typescript
 * import { CACHE_TIMES } from '@/lib/cache-config'
 * 
 * staleTime: CACHE_TIMES.DASHBOARD
 * ```
 */

/**
 * Stale Time Configuration
 * 
 * How long data is considered fresh before refetching.
 * - Lower = more fresh data, more requests
 * - Higher = less requests, potentially stale data
 */
export const STALE_TIMES = {
  /**
   * Dashboard/KPIs - Real-time data (30 seconds)
   * Used for: Overview, stats that need to be current
   */
  DASHBOARD: 30 * 1000, // 30 seconds

  /**
   * Lists - Frequently changing data (1 minute)
   * Used for: Deals list, orders list, redemptions list, staff list, media list
   */
  LISTS: 60 * 1000, // 1 minute

  /**
   * Details - Less frequently changing (5 minutes)
   * Used for: Single deal, order, staff member, media item
   */
  DETAILS: 5 * 60 * 1000, // 5 minutes

  /**
   * Settings - Rarely changing (10 minutes)
   * Used for: Merchant settings, profile, operating hours, notifications
   */
  SETTINGS: 10 * 60 * 1000, // 10 minutes

  /**
   * Static data - Never stale (or very long)
   * Used for: Categories, static configuration
   */
  STATIC: Infinity,
} as const

/**
 * Cache Time (Garbage Collection) Configuration
 * 
 * How long unused data stays in cache before garbage collection.
 * - Lower = faster memory cleanup, more refetches
 * - Higher = slower cleanup, fewer refetches
 * 
 * Default in React Query v5: 5 minutes
 */
export const CACHE_TIMES = {
  /**
   * Dashboard/KPIs - Short cache (2 minutes)
   * Real-time data doesn't need long caching
   */
  DASHBOARD: 2 * 60 * 1000, // 2 minutes

  /**
   * Lists - Medium cache (5 minutes)
   * Standard caching for list data
   */
  LISTS: 5 * 60 * 1000, // 5 minutes

  /**
   * Details - Longer cache (10 minutes)
   * Detail pages might be revisited
   */
  DETAILS: 10 * 60 * 1000, // 10 minutes

  /**
   * Settings - Long cache (15 minutes)
   * Settings rarely change, keep longer
   */
  SETTINGS: 15 * 60 * 1000, // 15 minutes
} as const

/**
 * Refetch Configuration
 * 
 * When to automatically refetch data
 */
export const REFETCH_CONFIG = {
  /**
   * Dashboard - Refetch on window focus
   * Keep real-time data fresh
   */
  DASHBOARD: {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },

  /**
   * Lists - Refetch on window focus
   * Keep lists relatively fresh
   */
  LISTS: {
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
  },

  /**
   * Details - Less aggressive refetching
   * Details don't change as often
   */
  DETAILS: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  },

  /**
   * Settings - Minimal refetching
   * Settings rarely change
   */
  SETTINGS: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
} as const

/**
 * Get cache configuration for a resource type
 */
export function getCacheConfig(type: 'dashboard' | 'lists' | 'details' | 'settings') {
  return {
    staleTime: STALE_TIMES[type.toUpperCase() as keyof typeof STALE_TIMES],
    gcTime: CACHE_TIMES[type.toUpperCase() as keyof typeof CACHE_TIMES],
    ...REFETCH_CONFIG[type.toUpperCase() as keyof typeof REFETCH_CONFIG],
  }
}

