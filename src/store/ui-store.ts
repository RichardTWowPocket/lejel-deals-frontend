import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Staff } from '@/types/common'

/**
 * UI Store
 * 
 * Manages global UI state including sidebar collapse, modal states, and UI preferences.
 * Persists sidebar state to localStorage, but not modal states (session-only).
 */
export interface UIStore {
  // Sidebar state (persisted)
  sidebarCollapsed: boolean

  // Staff modal state (not persisted)
  isStaffModalOpen: boolean
  editingStaff: Staff | null

  // Other modal states (not persisted)
  isDealModalOpen: boolean
  editingDealId: string | null

  // Toast preferences (persisted)
  toastPosition: 'top' | 'bottom'

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Staff modal actions
  openStaffModal: (staff?: Staff | null) => void
  closeStaffModal: () => void

  // Deal modal actions
  openDealModal: (dealId?: string | null) => void
  closeDealModal: () => void

  // Toast preferences
  setToastPosition: (position: 'top' | 'bottom') => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      sidebarCollapsed: false,
      isStaffModalOpen: false,
      editingStaff: null,
      isDealModalOpen: false,
      editingDealId: null,
      toastPosition: 'top',

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      // Staff modal actions
      openStaffModal: (staff: Staff | null = null) =>
        set({ isStaffModalOpen: true, editingStaff: staff }),

      closeStaffModal: () =>
        set({ isStaffModalOpen: false, editingStaff: null }),

      // Deal modal actions
      openDealModal: (dealId = null) =>
        set({ isDealModalOpen: true, editingDealId: dealId }),

      closeDealModal: () =>
        set({ isDealModalOpen: false, editingDealId: null }),

      // Toast preferences
      setToastPosition: (position: 'top' | 'bottom') =>
        set({ toastPosition: position }),
    }),
    {
      name: 'ui-storage',
      // Only persist sidebar state and toast preferences, not modal states
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        toastPosition: state.toastPosition,
      }),
    }
  )
)

