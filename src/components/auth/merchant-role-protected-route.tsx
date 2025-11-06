'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHasMerchantRole } from '@/hooks/use-has-merchant-role'
import { MerchantRole } from '@/lib/constants'
import { AccessDenied } from '@/components/merchant/shared/access-denied'

interface MerchantRoleProtectedRouteProps {
  children: React.ReactNode
  requiredRoles: MerchantRole[]
  merchantId?: string | null
  redirectTo?: string
  showAccessDenied?: boolean
}

/**
 * Merchant Role Protected Route
 * 
 * Protects routes based on merchant role permissions.
 * Can either redirect or show an access denied message.
 * 
 * @example
 * ```tsx
 * <MerchantRoleProtectedRoute requiredRoles={[MerchantRole.OWNER, MerchantRole.ADMIN]}>
 *   <SettingsPage />
 * </MerchantRoleProtectedRoute>
 * ```
 */
export function MerchantRoleProtectedRoute({
  children,
  requiredRoles,
  merchantId,
  redirectTo,
  showAccessDenied = true,
}: MerchantRoleProtectedRouteProps) {
  const router = useRouter()
  const { hasAccess, currentRole, isLoading } = useHasMerchantRole(
    requiredRoles,
    merchantId
  )

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [hasAccess, isLoading, redirectTo, router])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary' />
      </div>
    )
  }

  console.log('hasAccess: ', hasAccess)

  if (hasAccess === false) {
    if (showAccessDenied) {
      return (
        <AccessDenied
          requiredRoles={requiredRoles}
          currentRole={currentRole as MerchantRole}
        />
      )
    }
    return null
  }

  return <>{children}</>
}

