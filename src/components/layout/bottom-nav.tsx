'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  User,
  QrCode,
  Receipt,
  DollarSign,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const isMerchant = pathname.startsWith('/merchant')
  
  // Customer navigation items
  const customerNavItems = [
    {
      name: 'Dashboard',
      href: '/customer',
      icon: LayoutDashboard,
    },
    {
      name: 'Deals',
      href: '/customer/deals',
      icon: Tag,
    },
    {
      name: 'My Coupons',
      href: '/customer/coupons',
      icon: ShoppingBag,
    },
    {
      name: 'My Orders',
      href: '/customer/orders',
      icon: ShoppingBag,
    },
  ]

  // Merchant navigation items (first few from sidebar)
  const merchantNavItems = [
    {
      name: 'Overview',
      href: '/merchant',
      icon: LayoutDashboard,
    },
    {
      name: 'Deals',
      href: '/merchant/deals',
      icon: Tag,
    },
    {
      name: 'Scanner',
      href: '/merchant/verify',
      icon: QrCode,
    },
    {
      name: 'Orders',
      href: '/merchant/orders',
      icon: Receipt,
    },
  ]

  const navItems = isMerchant ? merchantNavItems : customerNavItems
  const profileHref = isMerchant ? '/merchant/settings' : '/customer/profile'

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-elegant-lg'>
      <div className='flex items-center justify-around h-16 px-2'>
        {navItems.map((item) => {
          // Dashboard should only be active on exact match, others can match subroutes
          const isActive = item.href === '/customer' || item.href === '/merchant'
            ? pathname === item.href || pathname === item.href + '/'
            : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 transition-all duration-200',
                isActive && 'scale-110'
              )} />
              <span className='text-[10px] font-medium truncate w-full text-center'>
                {item.name}
              </span>
            </Link>
          )
        })}
        
        {/* Profile Link */}
        <Link
          href={profileHref}
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1',
            pathname === profileHref || pathname.startsWith(profileHref + '/')
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <User className={cn(
            'h-5 w-5 transition-all duration-200',
            (pathname === profileHref || pathname.startsWith(profileHref + '/')) && 'scale-110'
          )} />
          <span className='text-[10px] font-medium truncate w-full text-center'>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  )
}

