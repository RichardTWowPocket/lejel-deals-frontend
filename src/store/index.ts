/**
 * Store Exports
 * 
 * Centralized exports for all Zustand stores
 * 
 * @example
 * ```tsx
 * import { useUIStore, useMerchantStore } from '@/store'
 * 
 * const { sidebarCollapsed, toggleSidebar } = useUIStore()
 * const { selectedMerchantId, setSelectedMerchant } = useMerchantStore()
 * ```
 */

export { useMerchantStore } from './merchant-store'
export type { MerchantStore } from './merchant-store'

export { useUIStore } from './ui-store'
export type { UIStore } from './ui-store'

// Re-export types for convenience
export type { Staff } from '@/types/common'

