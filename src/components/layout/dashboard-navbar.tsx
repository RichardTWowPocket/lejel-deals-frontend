'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { User } from 'lucide-react'

export function DashboardNavbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isMerchant = pathname.startsWith('/merchant')

  // Map routes to page names
  const getPageName = () => {
    if (pathname === '/customer' || pathname === '/merchant') {
      return 'Dashboard'
    }
    if (pathname.includes('/deals')) {
      return 'Deals'
    }
    if (pathname.includes('/coupons')) {
      return 'My Coupons'
    }
    if (pathname.includes('/orders')) {
      return 'My Orders'
    }
    if (pathname.includes('/profile')) {
      return 'Profile'
    }
    if (pathname.includes('/settings')) {
      return 'Settings'
    }
    if (pathname.includes('/verify') || pathname.includes('/scanner')) {
      return 'QR Scanner'
    }
    if (pathname.includes('/redemptions')) {
      return 'Redemptions'
    }
    if (pathname.includes('/payouts')) {
      return 'Payouts'
    }
    if (pathname.includes('/staff')) {
      return 'Staff'
    }
    if (pathname.includes('/media')) {
      return 'Media'
    }
    return 'Dashboard'
  }

  const pageName = getPageName()

  return (
    <nav className='block md:hidden sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        {/* Page Name */}
        <div>
          <h1 className='text-lg md:text-xl font-bold text-foreground'>
            {pageName}
          </h1>
        </div>

        {/* User Info */}
        <div className='flex items-center gap-3'>
          {/* User Details */}
          <div className='hidden sm:flex flex-col items-end'>
            <p className='text-sm font-semibold text-foreground'>
              {user?.name || 'User'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* Profile Picture */}
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-elegant border-2 border-border overflow-hidden'>
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user?.name || 'Profile'} 
                className='h-full w-full object-cover'
              />
            ) : (
              <User className='h-5 w-5 text-white' />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

