'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/lib/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    // Only process auth check once session loading is complete
    if (!isLoading) {
      setHasCheckedAuth(true)
      
      // Check authentication
      if (!isAuthenticated) {
        setShouldRedirect(true)
        router.push(redirectTo)
        return
      }

      // Check role authorization
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        setShouldRedirect(true)
        // Redirect to appropriate dashboard based on role
        if (user.role === UserRole.MERCHANT) {
          router.push('/merchant')
        } else if (user.role === UserRole.ADMIN) {
          router.push('/admin')
        } else if (user.role === UserRole.STAFF) {
          router.push('/merchant/scanner')
        } else {
          router.push('/customer')
        }
        return
      }

      // Auth passed, allow content to render
      setShouldRedirect(false)
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo])

  // Show loading spinner only on initial mount while checking auth
  if (isLoading && !hasCheckedAuth) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
      </div>
    )
  }

  // If redirect is needed, don't render content (prevents flash of content before redirect)
  if (shouldRedirect) {
    return null
  }

  // Show content optimistically once auth is verified
  // This allows content to render immediately after the first auth check passes
  return <>{children}</>
}

