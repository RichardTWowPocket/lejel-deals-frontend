'use client'

import { useAuth } from '@/hooks/use-auth'
import { useMerchant } from '@/lib/merchant-context'
import { useSession } from 'next-auth/react'
import { UserRole, MerchantRole } from '@/lib/constants'

/**
 * Hook to determine if the current user can access the QR Scanner feature.
 * 
 * QR Scanner should be HIDDEN for:
 * - SUPER_ADMIN users
 * - Users with OWNER merchant role
 * - Users with ADMIN merchant role
 * 
 * QR Scanner should be VISIBLE for:
 * - MANAGER, SUPERVISOR, CASHIER merchant roles
 */
export function useCanAccessQRScanner() {
  const { user } = useAuth()
  const { data: session } = useSession()
  
  // Try to get merchant context, but handle gracefully if not available
  let activeMerchantId: string | null = null
  try {
    const merchantContext = useMerchant()
    activeMerchantId = merchantContext.activeMerchantId
  } catch {
    // Not in merchant context, which is fine - we'll just check user role
  }

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 QR Scanner Access Check:', {
      userRole: user?.role,
      activeMerchantId,
      hasSession: !!session,
      merchantMemberships: session?.merchantMemberships,
      merchantMembershipsLength: session?.merchantMemberships?.length,
    })
  }

  // If user is SUPER_ADMIN, hide QR scanner
  if (user?.role === UserRole.SUPER_ADMIN) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Hiding QR Scanner: User is SUPER_ADMIN')
    }
    return false
  }

  // If user is MERCHANT, check their merchant role from session
  if (user?.role === UserRole.MERCHANT) {
    if (!activeMerchantId) {
      // No active merchant selected, default to showing (but this shouldn't happen in merchant dashboard)
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ No active merchant ID, defaulting to show QR Scanner')
      }
      return true
    }

    if (!session?.merchantMemberships || session.merchantMemberships.length === 0) {
      // No membership data in session - this might mean session needs refresh
      // For safety, hide QR scanner if we can't determine role
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No merchantMemberships in session, hiding QR Scanner for safety')
      }
      return false
    }

    // Find membership for the active merchant
    const membership = session.merchantMemberships.find(
      (m) => m.merchantId === activeMerchantId
    )

    if (membership) {
      const merchantRole = membership.merchantRole as MerchantRole
      const isOwner = membership.isOwner

      if (process.env.NODE_ENV === 'development') {
        console.log('📋 Membership found:', {
          merchantId: membership.merchantId,
          merchantRole,
          isOwner,
        })
      }

      // Hide QR scanner for OWNER or ADMIN
      if (isOwner || merchantRole === MerchantRole.OWNER || merchantRole === MerchantRole.ADMIN) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Hiding QR Scanner: User is OWNER or ADMIN')
        }
        return false
      }
    } else {
      // Membership not found for active merchant
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No membership found for active merchant, hiding QR Scanner for safety')
      }
      return false
    }
  }

  // Default: show QR scanner for other roles (MANAGER, SUPERVISOR, CASHIER)
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Showing QR Scanner: User has appropriate role')
  }
  return true
}
