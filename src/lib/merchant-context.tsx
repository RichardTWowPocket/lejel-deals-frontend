'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useMerchantStore } from '@/store'

/**
 * Merchant Context
 * 
 * Manages active merchant selection for users with multiple merchant memberships.
 * Integrates with Zustand store for persistence and NextAuth session for merchant IDs.
 */
interface MerchantContextType {
  activeMerchantId: string | null
  merchantIds: string[]
  setActiveMerchantId: (id: string | null) => void
  switchMerchant: (id: string) => void
  hasMultipleMerchants: boolean
  isLoading: boolean
}

const MerchantContext = createContext<MerchantContextType | null>(null)

interface MerchantProviderProps {
  children: React.ReactNode
}

/**
 * Merchant Provider
 * 
 * Provides merchant context to all child components.
 * Handles active merchant selection, persistence, and validation.
 */
export function MerchantProvider({ children }: MerchantProviderProps) {
  // Use useSession with minimal refetch to prevent excessive session checks
  const { data: session, status } = useSession({
    required: false,
    // Prevent automatic refetching - we'll handle it manually if needed
  })
  const { selectedMerchantId, setSelectedMerchant, clearSelection } =
    useMerchantStore()

  // Memoize merchantIds to prevent unnecessary re-renders
  const merchantIds = useMemo(() => session?.merchantIds || [], [session?.merchantIds])
  const isLoading = status === 'loading'

  // Initialize active merchant from store or session
  const [activeMerchantId, setActiveMerchantIdState] = useState<string | null>(null)
  // Use ref to track current value without triggering re-renders
  const activeMerchantIdRef = useRef<string | null>(null)
  
  // Update ref whenever state changes
  useEffect(() => {
    activeMerchantIdRef.current = activeMerchantId
  }, [activeMerchantId])

  // Auto-select first merchant if none selected and merchantIds are available
  // This effect runs when merchantIds or selectedMerchantId changes, not when activeMerchantId changes
  useEffect(() => {
    if (isLoading) return

    // If we have a stored selection and it's valid, use it
    if (selectedMerchantId && merchantIds.includes(selectedMerchantId)) {
      setActiveMerchantIdState((prev) => {
        // Only update if different to prevent unnecessary re-renders
        return prev !== selectedMerchantId ? selectedMerchantId : prev
      })
      return
    }

    // If merchantIds are available but no valid selection
    if (merchantIds.length > 0) {
      const currentActive = activeMerchantIdRef.current
      // If current active is not in merchantIds, select first available
      if (currentActive && !merchantIds.includes(currentActive)) {
        const firstMerchantId = merchantIds[0]
        setActiveMerchantIdState(firstMerchantId)
        setSelectedMerchant(firstMerchantId)
        return
      }
      // If no active merchant, auto-select first one
      if (!currentActive) {
        const firstMerchantId = merchantIds[0]
        setActiveMerchantIdState(firstMerchantId)
        setSelectedMerchant(firstMerchantId)
        return
      }
    } else {
      // If user has no merchants, clear selection
      setActiveMerchantIdState(null)
      clearSelection()
    }
  }, [merchantIds, selectedMerchantId, isLoading, setSelectedMerchant, clearSelection])

  const setActiveMerchantId = useCallback(
    (id: string | null) => {
      setActiveMerchantIdState(id)
      if (id) {
        setSelectedMerchant(id)
      } else {
        clearSelection()
      }
    },
    [setSelectedMerchant, clearSelection]
  )

  const switchMerchant = useCallback(
    (id: string) => {
      if (!merchantIds.includes(id)) {
        throw new Error("Merchant ID not in user's merchant list")
      }
      setActiveMerchantId(id)
    },
    [merchantIds, setActiveMerchantId]
  )

  const hasMultipleMerchants = merchantIds.length > 1

  const value: MerchantContextType = {
    activeMerchantId,
    merchantIds,
    setActiveMerchantId,
    switchMerchant,
    hasMultipleMerchants,
    isLoading,
  }

  return (
    <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>
  )
}

/**
 * useMerchant Hook
 * 
 * Hook to access merchant context.
 * Must be used within MerchantProvider.
 * 
 * @example
 * ```tsx
 * const { activeMerchantId, switchMerchant, hasMultipleMerchants } = useMerchant()
 * ```
 */
export function useMerchant() {
  const context = useContext(MerchantContext)
  if (!context) {
    throw new Error('useMerchant must be used within MerchantProvider')
  }
  return context
}



