import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Merchant Store
 * 
 * Manages the selected merchant for users with multiple merchant memberships.
 * Persists selection to localStorage for cross-session persistence.
 */
export interface MerchantStore {
  // Selected merchant (for users with multiple merchants)
  selectedMerchantId: string | null

  // Actions
  setSelectedMerchant: (merchantId: string) => void
  clearSelection: () => void
}

export const useMerchantStore = create<MerchantStore>()(
  persist(
    (set) => ({
      selectedMerchantId: null,

      setSelectedMerchant: (merchantId: string) =>
        set({ selectedMerchantId: merchantId }),

      clearSelection: () => set({ selectedMerchantId: null }),
    }),
    {
      name: 'merchant-storage', // localStorage key
    }
  )
)

