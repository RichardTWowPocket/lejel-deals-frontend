/**
 * Query Key Factory
 * 
 * Centralized, type-safe query key management for React Query.
 * Provides consistent key patterns and easy invalidation.
 * 
 * @example
 * ```typescript
 * // In hooks
 * queryKey: merchantKeys.overview.me(activeMerchantId)
 * 
 * // In mutations
 * queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all })
 * queryClient.invalidateQueries({ queryKey: merchantKeys.deals.list(filters) })
 * ```
 */

import type { DealFilters } from '@/types/deal'
import type { MerchantFilters } from '@/types/merchant'
import type { CouponStatus } from '@/types/coupon'

// ============================================================================
// Merchant Dashboard Keys (for merchant-scoped data)
// ============================================================================

export const merchantKeys = {
  all: ['merchant'] as const,

  // Overview
  overview: {
    all: ['merchant', 'overview'] as const,
    me: (merchantId?: string | null) => 
      [...merchantKeys.overview.all, 'me', merchantId] as const,
  },

  // Payouts
  payouts: {
    all: ['merchant', 'payouts'] as const,
    me: (period?: string, merchantId?: string | null) => 
      [...merchantKeys.payouts.all, 'me', period, merchantId] as const,
  },

  // Deals (merchant-scoped)
  deals: {
    all: ['merchant', 'deals'] as const,
    me: () => [...merchantKeys.deals.all, 'me'] as const,
    list: (merchantId?: string, page?: number, limit?: number) => 
      [...merchantKeys.deals.all, merchantId, page, limit] as const,
    detail: (dealId: string) => 
      [...merchantKeys.deals.all, 'detail', dealId] as const,
    filters: (filters?: DealFilters) => 
      [...merchantKeys.deals.me(), 'list', filters] as const,
    infinite: (filters?: DealFilters) => 
      [...merchantKeys.deals.me(), 'infinite', filters] as const,
  },

  // Orders (merchant-scoped)
  orders: {
    all: ['merchant', 'orders'] as const,
    me: () => [...merchantKeys.orders.all, 'me'] as const,
    list: (filters?: { page?: number; limit?: number; status?: string; dealId?: string; startDate?: string; endDate?: string; merchantId?: string }) => 
      [...merchantKeys.orders.me(), 'list', filters] as const,
    detail: (orderId: string) => 
      [...merchantKeys.orders.me(), 'detail', orderId] as const,
    stats: () => [...merchantKeys.orders.me(), 'stats'] as const,
  },

  // Redemptions (merchant-scoped)
  redemptions: {
    all: ['merchant', 'redemptions'] as const,
    me: () => [...merchantKeys.redemptions.all, 'me'] as const,
    list: (filters?: any) => 
      [...merchantKeys.redemptions.me(), 'list', filters] as const,
    stats: () => 
      [...merchantKeys.redemptions.me(), 'stats'] as const,
  },

  // Staff (merchant-scoped)
  staff: {
    all: ['merchant', 'staff'] as const,
    me: () => [...merchantKeys.staff.all, 'me'] as const,
    list: () => [...merchantKeys.staff.me(), 'list'] as const,
    detail: (staffId: string) => 
      [...merchantKeys.staff.me(), 'detail', staffId] as const,
    stats: () => [...merchantKeys.staff.me(), 'stats'] as const,
  },

  // Payouts (merchant-scoped)
  payouts: {
    all: ['merchant', 'payouts'] as const,
    me: () => [...merchantKeys.payouts.all, 'me'] as const,
    list: (period?: string) => 
      [...merchantKeys.payouts.me(), 'list', period] as const,
    stats: () => 
      [...merchantKeys.payouts.me(), 'stats'] as const,
  },

  // Media (merchant-scoped)
  media: {
    all: ['merchant', 'media'] as const,
    me: () => [...merchantKeys.media.all, 'me'] as const,
    list: (filters?: { page?: number; limit?: number; search?: string; mimeType?: string; sortBy?: string; sortOrder?: string }) =>
      [...merchantKeys.media.me(), 'list', filters] as const,
    detail: (mediaId: string) =>
      [...merchantKeys.media.me(), 'detail', mediaId] as const,
  },

  // Settings (merchant-scoped)
  settings: {
    all: ['merchant', 'settings'] as const,
    me: (merchantId?: string | null) =>
      [...merchantKeys.settings.all, 'me', merchantId] as const,
    profile: (merchantId?: string | null) =>
      [...merchantKeys.settings.me(merchantId), 'profile'] as const,
    business: (merchantId?: string | null) =>
      [...merchantKeys.settings.me(merchantId), 'business'] as const,
    operatingHours: (merchantId?: string | null) =>
      [...merchantKeys.settings.me(merchantId), 'operating-hours'] as const,
    notifications: (merchantId?: string | null) =>
      [...merchantKeys.settings.me(merchantId), 'notifications'] as const,
  },
} as const

// ============================================================================
// Public Deals Keys (for customer-facing deals)
// ============================================================================

export const dealKeys = {
  all: ['deals'] as const,
  lists: (filters?: DealFilters) => 
    [...dealKeys.all, 'list', filters] as const,
  detail: (slug: string) => 
    [...dealKeys.all, 'detail', slug] as const,
  featured: (limit?: number) => 
    [...dealKeys.all, 'featured', limit] as const,
} as const

// ============================================================================
// Public Merchant Keys (for customer-facing merchants)
// ============================================================================

export const publicMerchantKeys = {
  all: ['merchants'] as const,
  lists: (filters?: MerchantFilters) => 
    [...publicMerchantKeys.all, 'list', filters] as const,
  detail: (slug: string) => 
    [...publicMerchantKeys.all, 'detail', slug] as const,
  featured: (limit?: number) => 
    [...publicMerchantKeys.all, 'featured', limit] as const,
} as const

// ============================================================================
// Customer Keys (for customer-scoped data)
// ============================================================================

export const customerKeys = {
  all: ['customer'] as const,

  // Orders
  orders: {
    all: ['customer', 'orders'] as const,
    me: () => [...customerKeys.orders.all, 'me'] as const,
    list: (page?: number, limit?: number) => 
      [...customerKeys.orders.me(), 'list', page, limit] as const,
    detail: (orderId: string) => 
      [...customerKeys.orders.me(), 'detail', orderId] as const,
  },

  // Coupons
  coupons: {
    all: ['customer', 'coupons'] as const,
    me: () => [...customerKeys.coupons.all, 'me'] as const,
    list: (page?: number, limit?: number, status?: CouponStatus) => 
      [...customerKeys.coupons.me(), 'list', page, limit, status] as const,
    byOrder: (orderId: string) => 
      [...customerKeys.coupons.me(), 'order', orderId] as const,
    active: (limit?: number) => 
      [...customerKeys.coupons.me(), 'active', limit] as const,
  },
} as const

// ============================================================================
// System Keys
// ============================================================================

export const systemKeys = {
  all: ['system'] as const,
  serverTime: () => [...systemKeys.all, 'server-time'] as const,
} as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Invalidate all merchant queries
 */
export function invalidateAllMerchantQueries(queryClient: any) {
  queryClient.invalidateQueries({ queryKey: merchantKeys.all })
}

/**
 * Invalidate all deal queries (both merchant and public)
 */
export function invalidateAllDealQueries(queryClient: any) {
  queryClient.invalidateQueries({ queryKey: merchantKeys.deals.all })
  queryClient.invalidateQueries({ queryKey: dealKeys.all })
}

/**
 * Invalidate all customer queries
 */
export function invalidateAllCustomerQueries(queryClient: any) {
  queryClient.invalidateQueries({ queryKey: customerKeys.all })
}

