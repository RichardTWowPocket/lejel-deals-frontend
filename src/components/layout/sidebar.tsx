'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigationItems = [
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

  return (
    <div className={cn(
      'hidden md:flex h-screen flex-col bg-background border-r border-border/50 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64',
      className
    )}>
      {/* Logo Section */}
      <div className={cn(
        'flex items-center border-b border-border/50 transition-all duration-300',
        isCollapsed ? 'justify-center p-4' : 'justify-between p-6'
      )}>
        {!isCollapsed ? (
          <>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant-lg flex-shrink-0'>
                <span className='text-xl font-bold text-white'>L</span>
              </div>
              <span className='text-xl font-bold text-gradient-primary truncate'>Lejel Deals</span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Toggle button clicked!', isCollapsed)
                setIsCollapsed(!isCollapsed)
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
                console.log('Toggle button clicked!', isCollapsed)
                setIsCollapsed(!isCollapsed)
              }}
              className='h-8 w-8 p-0 hover:bg-muted/50 rounded-lg transition-all duration-200 hover:scale-105'
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
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
        <Link href='/customer/profile'>
          <div className={cn(
            'flex items-center rounded-xl bg-muted/30 transition-all duration-300 cursor-pointer hover:bg-muted/50 hover:shadow-sm',
            isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'
          )}>
            {/* Profile Picture */}
            <Avatar className={cn(
              'border-2 border-border shadow-sm',
              isCollapsed ? 'h-10 w-10' : 'h-10 w-10'
            )}>
              <AvatarImage src={user?.avatar || user?.image || undefined} alt={user?.name || 'User'} />
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
                  {user?.name || 'User'}
                </p>
                <p className='text-xs text-muted-foreground truncate'>
                  {user?.email || 'user@example.com'}
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
