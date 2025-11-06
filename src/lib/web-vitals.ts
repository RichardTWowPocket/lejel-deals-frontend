/**
 * Web Vitals Monitoring
 * 
 * Reports Core Web Vitals metrics for performance monitoring.
 * Integrates with Next.js Web Vitals API.
 */

import { reportWebVitals } from './performance'

/**
 * Report Web Vitals metrics
 * 
 * Call this from _app.tsx or app/layout.tsx to measure:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */
export function onReportWebVitals(metric: any) {
  reportWebVitals({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
  })

  // Example: Send to analytics service
  // if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
  //   fetch('/api/analytics', {
  //     method: 'POST',
  //     body: JSON.stringify(metric),
  //   })
  // }
}

