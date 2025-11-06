'use client'

import { useAuth } from '@/hooks/use-auth'
import { useMerchant } from '@/lib/merchant-context'
import { useSession } from 'next-auth/react'
import { UserRole, MerchantRole } from '@/lib/constants'

/**
 * Role hierarchy for merchant roles (higher number = more permissions)
 * OWNER > ADMIN > MANAGER > SUPERVISOR > CASHIER
 */
const MERCHANT_ROLE_HIERARCHY: Record<MerchantRole, number> = {
  [MerchantRole.OWNER]: 5,
  [MerchantRole.ADMIN]: 4,
  [MerchantRole.MANAGER]: 3,
  [MerchantRole.SUPERVISOR]: 2,
  [MerchantRole.CASHIER]: 1,
}

/**
 * Check if userRole has access equivalent to requiredRole
 * Higher roles have access to lower role permissions
 */
function hasRoleAccess(
  userRole: MerchantRole,
  requiredRole: MerchantRole,
): boolean {
  return MERCHANT_ROLE_HIERARCHY[userRole] >= MERCHANT_ROLE_HIERARCHY[requiredRole]
}

/**
 * Hook to check if the current user has one of the required merchant roles.
 * 
 * @param requiredRoles - Array of merchant roles that grant access
 * @param merchantId - Optional merchant ID to check. If not provided, uses active merchant from context
 * @returns Object with `hasAccess`, `currentRole`, and `isLoading` properties
 * 
 * @example
 * ```tsx
 * // Simple usage - uses active merchant from context
 * const { hasAccess } = useHasMerchantRole([
 *   MerchantRole.OWNER,
 *   MerchantRole.ADMIN,
 *   MerchantRole.MANAGER,
 * ])
 * 
 * // With specific merchant ID
 * const { hasAccess, currentRole, isLoading } = useHasMerchantRole(
 *   [MerchantRole.OWNER, MerchantRole.ADMIN],
 *   'merchant-id-123'
 * )
 * ```
 */
export function useHasMerchantRole(
  requiredRoles: MerchantRole[],
  merchantId?: string | null
) {
  const { user, isLoading: authLoading } = useAuth()
  const { data: session, status: sessionStatus } = useSession()
  
  // Try to get merchant context, but handle gracefully if not available
  let activeMerchantId: string | null = null
  try {
    const merchantContext = useMerchant()
    activeMerchantId = merchantContext.activeMerchantId
  } catch {
    // Not in merchant context, which is fine - we'll just check user role
  }

  // Use provided merchantId or fall back to active merchant from context
  const targetMerchantId = merchantId ?? activeMerchantId

  // Determine loading state
  const isLoading = authLoading || sessionStatus === 'loading'

  // If still loading, return loading state
  if (isLoading) {
    return { hasAccess: false, currentRole: null, isLoading: true }
  }

  // If user is SUPER_ADMIN, they have access to everything
  if (user?.role === UserRole.SUPER_ADMIN) {
    return { hasAccess: true, currentRole: null, isLoading: false }
  }

  // If user is not a MERCHANT, they don't have merchant roles
  if (user?.role !== UserRole.MERCHANT) {
    return { hasAccess: false, currentRole: null, isLoading: false }
  }

  // If no merchant ID available, no access
  if (!targetMerchantId) {
    return { hasAccess: false, currentRole: null, isLoading: false }
  }

  // If no merchantMemberships in session, no access
  if (!session?.merchantMemberships || session.merchantMemberships.length === 0) {
    return { hasAccess: false, currentRole: null, isLoading: false }
  }

  // Find membership for the target merchant
  const membership = session.merchantMemberships.find(
    (m) => m.merchantId === targetMerchantId
  )

  if (!membership) {
    return { hasAccess: false, currentRole: null, isLoading: false }
  }

  const userMerchantRole = membership.merchantRole as MerchantRole
  const isOwner = membership.isOwner

  // OWNER always has access (even if not in requiredRoles, they have all permissions)
  if (isOwner || userMerchantRole === MerchantRole.OWNER) {
    return { 
      hasAccess: true, 
      currentRole: MerchantRole.OWNER, 
      isLoading: false 
    }
  }

  // Check if user has one of the required roles
  // Using role hierarchy: higher roles have access to lower role permissions
  const hasAccess = requiredRoles.some((requiredRole) =>
    hasRoleAccess(userMerchantRole, requiredRole),
  )

  return { 
    hasAccess, 
    currentRole: userMerchantRole, 
    isLoading: false 
  }
}
