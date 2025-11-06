'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useUIStore } from '@/store'
import { 
  LayoutDashboard, 
  Tag, 
  QrCode,
  Receipt,
  DollarSign,
  Users,
  Settings,
  Image,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MerchantSelector } from '@/components/merchant/merchant-selector'
import { useCanAccessQRScanner } from '@/hooks/use-can-access-qr-scanner'

interface MerchantSidebarProps {
  className?: string
}

export function MerchantSidebar({ className }: MerchantSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const isCollapsed = sidebarCollapsed
  const canAccessQRScanner = useCanAccessQRScanner()

  const navigationItems = [
    {
      name: 'Overview',
      href: '/merchant/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Deals',
      href: '/merchant/deals',
      icon: Tag,
    },
    {
      name: 'QR Scanner',
      href: '/merchant/verify',
      icon: QrCode,
      hidden: !canAccessQRScanner, // Hide if user cannot access QR scanner
    },
    {
      name: 'Redemptions',
      href: '/merchant/redemptions',
      icon: Receipt,
    },
    {
      name: 'Orders',
      href: '/merchant/orders',
      icon: Receipt,
    },
    {
      name: 'Payouts',
      href: '/merchant/payouts',
      icon: DollarSign,
    },
    {
      name: 'Staff',
      href: '/merchant/staff',
      icon: Users,
    },
    {
      name: 'Media',
      href: '/merchant/media',
      icon: Image,
    },
    {
      name: 'Settings',
      href: '/merchant/settings',
      icon: Settings,
    },
  ].filter((item) => !item.hidden) // Filter out hidden items

  return (
    <div className={cn(
      'hidden md:flex h-screen flex-col bg-background border-r border-border/50 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64',
      className
    )}>
      {/* Logo Section */}
      <div className={cn(
        'flex flex-col border-b border-border/50 transition-all duration-300',
        isCollapsed ? 'p-4' : 'p-6'
      )}>
        <div className={cn(
          'flex items-center transition-all duration-300',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!isCollapsed ? (
            <>
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant-lg flex-shrink-0'>
                  <span className='text-xl font-bold text-white'>L</span>
                </div>
                <span className='text-xl font-bold text-gradient-primary truncate'>Merchant</span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleSidebar()
                }}
                className='h-10 w-10 p-0 hover:bg-muted/50 rounded-lg transition-all duration-200 hover:scale-105'
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronLeft className='h-5 w-5' />
              </Button>
            </>
          ) : (
            <div className='flex flex-col items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant-lg'>
                <span className='text-xl font-bold text-white'>L</span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleSidebar()
                }}
                className='h-8 w-8 p-0 hover:bg-muted/50 rounded-lg transition-all duration-200 hover:scale-105'
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
        
        {/* Merchant Selector (only when expanded and multiple merchants) */}
        {!isCollapsed && (
          <div className='mt-4'>
            <MerchantSelector />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full h-12 rounded-xl transition-all duration-300',
                  isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4',
                  isActive 
                    ? 'bg-gradient-primary text-white shadow-elegant-lg' 
                    : 'hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon className={cn(
                  'transition-all duration-300',
                  isCollapsed ? 'h-6 w-6' : 'h-5 w-5'
                )} />
                {!isCollapsed && (
                  <span className='font-medium'>{item.name}</span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className='p-4 border-t border-border/50'>
        <Link href='/merchant/settings'>
          <div className={cn(
            'flex items-center rounded-xl bg-muted/30 transition-all duration-300 cursor-pointer hover:bg-muted/50 hover:shadow-sm',
            isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'
          )}>
            {/* Profile Picture */}
            <Avatar className={cn(
              'border-2 border-border shadow-sm',
              isCollapsed ? 'h-10 w-10' : 'h-10 w-10'
            )}>
              <AvatarImage src={user?.avatar || user?.image || undefined} alt={user?.name || 'Merchant'} />
              <AvatarFallback className='bg-white text-muted-foreground'>
                <User className={cn(
                  'text-muted-foreground',
                  isCollapsed ? 'h-6 w-6' : 'h-5 w-5'
                )} />
              </AvatarFallback>
            </Avatar>
            
            {/* User Info */}
            {!isCollapsed && (
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-foreground truncate'>
                  {user?.name || 'Merchant'}
                </p>
                <p className='text-xs text-muted-foreground truncate'>
                  {user?.email || 'merchant@example.com'}
                </p>
              </div>
            )}
            
            {/* Settings Icon (only when not collapsed) */}
            {!isCollapsed && (
              <Settings className='h-4 w-4 text-muted-foreground' />
            )}
          </div>
        </Link>

        {/* Logout Button */}
        <Button
          variant='ghost'
          onClick={logout}
          className={cn(
            'w-full h-12 rounded-xl mt-3 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300',
            isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className={cn(
            'transition-all duration-300',
            isCollapsed ? 'h-6 w-6' : 'h-5 w-5'
          )} />
          {!isCollapsed && (
            <span className='font-medium'>Logout</span>
          )}
        </Button>
      </div>
    </div>
  )
}



