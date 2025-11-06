/**
 * Performance Utilities
 * 
 * Utilities for monitoring and measuring performance metrics.
 * Used for performance testing and optimization.
 */

import React from 'react'

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  log = false
): T {
  if (typeof window === 'undefined') return fn()

  const start = performance.now()
  const result = fn()
  const end = performance.now()
  const duration = end - start

  if (log) {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * Measure async function execution time
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  log = false
): Promise<T> {
  if (typeof window === 'undefined') return fn()

  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = end - start

  if (log) {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * Web Vitals metrics
 */
export interface WebVitals {
  name: string
  value: number
  id: string
  delta?: number
}

/**
 * Report Web Vitals to console (or analytics)
 */
export function reportWebVitals(metric: WebVitals) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric)
  }

  // In production, you can send to analytics service
  // Example: sendToAnalytics(metric)
}

/**
 * Get resource timing for a specific resource
 */
export function getResourceTiming(url: string) {
  if (typeof window === 'undefined' || !window.performance) return null

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  return resources.find((resource) => resource.name.includes(url))
}

/**
 * Get navigation timing
 */
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!navigation) return null

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    load: navigation.loadEventEnd - navigation.loadEventStart,
    total: navigation.loadEventEnd - navigation.fetchStart,
  }
}

/**
 * Check if page is loaded
 */
export function isPageLoaded(): boolean {
  if (typeof window === 'undefined') return false
  return document.readyState === 'complete'
}

/**
 * Wait for page to be fully loaded
 */
export function waitForPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    if (document.readyState === 'complete') {
      resolve()
      return
    }

    window.addEventListener('load', () => resolve(), { once: true })
  })
}

/**
 * Measure component render time
 * Note: This is a simplified version. For production, consider using React DevTools Profiler
 */
export function measureComponentRender<T extends React.ComponentType<any>>(
  Component: T,
  name?: string
): T {
  const componentName = name || (Component as any).displayName || (Component as any).name || 'Component'

  const MeasuredComponent = (props: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const start = performance.now()
      // Component will be rendered by React
      const end = performance.now()
      if (end - start > 0) {
        console.log(`[Render] ${componentName}: ${(end - start).toFixed(2)}ms`)
      }
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />
  }

  MeasuredComponent.displayName = componentName
  return MeasuredComponent as T
}

