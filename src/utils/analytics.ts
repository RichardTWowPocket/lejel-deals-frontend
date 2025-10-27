/**
 * Analytics and telemetry tracking utilities
 */

export type AnalyticsEvent = 
  | 'deals_view'
  | 'deals_filter_change'
  | 'deals_sort_change'
  | 'deal_card_view'
  | 'deal_card_click'
  | 'deal_detail_view'
  | 'buy_click'
  | 'notify_click'
  | 'favorite_toggle'
  | 'category_select'
  | 'personalization_chip_click'
  | 'search_performed'
  | 'filter_applied'
  | 'page_scroll'

export interface AnalyticsProperties {
  deal_id?: string
  merchant_id?: string
  category_id?: string
  display_savings_pct?: number
  time_to_end_bucket?: string
  filter_type?: string
  filter_value?: string
  sort_by?: string
  sort_order?: string
  search_query?: string
  page_number?: number
  [key: string]: any
}

/**
 * Track analytics event
 */
export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  if (typeof window === 'undefined') return

  // In production, this would send to your analytics service
  // For example: Google Analytics, Mixpanel, Segment, etc.
  
  console.log('[Analytics]', event, properties)
  
  // Example: Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', event, properties)
  // }
  
  // Example: Mixpanel
  // if (window.mixpanel) {
  //   window.mixpanel.track(event, properties)
  // }
}

/**
 * Track deal card impressions
 */
export function trackDealCardView(dealId: string, dealProperties?: Partial<AnalyticsProperties>) {
  trackEvent('deal_card_view', {
    deal_id: dealId,
    ...dealProperties,
  })
}

/**
 * Track deal card clicks
 */
export function trackDealCardClick(dealId: string, dealProperties?: Partial<AnalyticsProperties>) {
  trackEvent('deal_card_click', {
    deal_id: dealId,
    ...dealProperties,
  })
}

/**
 * Track filter changes
 */
export function trackFilterChange(filterType: string, filterValue: string | number) {
  trackEvent('deals_filter_change', {
    filter_type: filterType,
    filter_value: String(filterValue),
  })
}

/**
 * Track sort changes
 */
export function trackSortChange(sortBy: string, sortOrder: string) {
  trackEvent('deals_sort_change', {
    sort_by: sortBy,
    sort_order: sortOrder,
  })
}

/**
 * Track personalization chip clicks
 */
export function trackPersonalizationChip(chipId: string) {
  trackEvent('personalization_chip_click', {
    filter_type: 'personalization',
    filter_value: chipId,
  })
}

/**
 * Track category selection
 */
export function trackCategorySelect(categoryId: string, categoryName: string) {
  trackEvent('category_select', {
    category_id: categoryId,
    filter_value: categoryName,
  })
}

/**
 * Track search
 */
export function trackSearch(query: string, resultCount?: number) {
  trackEvent('search_performed', {
    search_query: query,
    ...(resultCount !== undefined && { result_count: resultCount }),
  })
}

/**
 * Time to end bucket helper
 */
export function getTimeToEndBucket(secondsRemaining: number): string {
  if (secondsRemaining < 0) return 'expired'
  if (secondsRemaining < 3600) return '<1h'
  if (secondsRemaining < 86400) return '1h-24h'
  if (secondsRemaining < 604800) return '1d-7d'
  return '>7d'
}

