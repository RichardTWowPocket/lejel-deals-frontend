'use client'

import { MerchantSidebar } from '@/components/layout/merchant-sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { DashboardNavbar } from '@/components/layout/dashboard-navbar'
import { MerchantProvider } from '@/lib/merchant-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ErrorBoundary } from '@/components/merchant/shared'
import { UserRole } from '@/lib/constants'

/**
 * Merchant Dashboard Layout
 * 
 * Protected route that requires MERCHANT or SUPER_ADMIN role.
 * Wraps all merchant dashboard pages with:
 * - Authentication check
 * - Role authorization
 * - Merchant context provider
 * - Sidebar navigation
 * - Responsive layout
 */
export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedRoles={[UserRole.MERCHANT, UserRole.SUPER_ADMIN]}
      redirectTo="/login"
    >
      <MerchantProvider>
        <div className='flex h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
          {/* Sidebar */}
          <MerchantSidebar />
          
          {/* Main Content Area */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            {/* Top Navbar */}
            <DashboardNavbar />
            
            {/* Main Content */}
            <main className='flex-1 overflow-y-auto pb-16 md:pb-0'>
              <div className='p-4 md:p-6'>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </main>
          </div>

          {/* Bottom Navigation (Mobile Only) */}
          <BottomNav />
        </div>
      </MerchantProvider>
    </ProtectedRoute>
  )
}



