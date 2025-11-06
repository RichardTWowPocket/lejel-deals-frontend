'use client'

import { useHasMerchantRole } from '@/hooks/use-has-merchant-role'
import { MerchantRole } from '@/lib/constants'

/**
 * Hook to check what actions the current user can perform based on their merchant role.
 * 
 * Returns boolean flags for various merchant actions.
 * 
 * @returns Object with permission flags for different actions
 * 
 * @example
 * ```tsx
 * const { canCreateDeal, canEditDeal, canPublishDeal } = useCanPerformAction()
 * 
 * if (canCreateDeal) {
 *   // Show create deal button
 * }
 * ```
 */
export function useCanPerformAction() {
  // Staff management permissions (OWNER, ADMIN, MANAGER)
  const { hasAccess: canManageStaff } = useHasMerchantRole([
    MerchantRole.OWNER,
    MerchantRole.ADMIN,
    MerchantRole.MANAGER,
  ])

  // Deal management permissions (OWNER, ADMIN, MANAGER)
  const { hasAccess: canManageDeals } = useHasMerchantRole([
    MerchantRole.OWNER,
    MerchantRole.ADMIN,
    MerchantRole.MANAGER,
  ])

  // Return permission flags
  return {
    // Staff permissions
    canCreateStaff: canManageStaff,
    canViewStaff: canManageStaff,
    canEditStaff: canManageStaff,
    canDeleteStaff: canManageStaff,

    // Deal permissions
    canCreateDeal: canManageDeals,
    canEditDeal: canManageDeals,
    canPublishDeal: canManageDeals,
    canDeleteDeal: canManageDeals,
    canPauseDeal: canManageDeals,
    canResumeDeal: canManageDeals,
  }
}
