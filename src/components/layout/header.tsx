'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, ShoppingBag, Store, LayoutDashboard, Menu, X } from 'lucide-react'

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getDashboardLink = () => {
    if (!user) return '/customer'
    switch (user.role) {
      case UserRole.MERCHANT:
        return '/merchant'
      case UserRole.ADMIN:
        return '/admin'
      case UserRole.STAFF:
        return '/merchant/scanner'
      default:
        return '/customer'
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='relative sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-elegant'>
      <div className='container mx-auto flex h-20 items-center justify-between px-4'>
        <Link href='/' className='flex items-center space-x-3 group'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant-lg group-hover:shadow-elegant-xl transition-all duration-300 group-hover:scale-105'>
              <span className='text-xl font-bold text-white'>L</span>
            </div>
            <span className='text-2xl font-bold text-gradient-primary group-hover:text-gradient-secondary transition-all duration-300'>Lejel Deals</span>
          </div>
        </Link>

        <nav className='hidden items-center gap-8 md:flex'>
          <Link
            href='/deals'
            className='text-base font-regular transition-all duration-300 hover:text-gradient-primary hover:scale-105'
          >
            Promo
          </Link>
          <Link
            href='/merchants'
            className='text-base font-regular transition-all duration-300 hover:text-gradient-secondary hover:scale-105'
          >
            Merchant
          </Link>
          <Link
            href='/categories'
            className='text-base font-regular transition-all duration-300 hover:text-gradient-primary hover:scale-105'
          >
            Kategori
          </Link>
        </nav>

        <div className='flex items-center gap-4'>
          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6 transition-transform duration-300 rotate-180' />
            ) : (
              <Menu className='h-6 w-6 transition-transform duration-300' />
            )}
          </Button>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center gap-4'>
            {isLoading ? (
              <div className='h-10 w-10 animate-pulse rounded-full bg-gradient-muted' />
            ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-muted/50 transition-all duration-300'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-white shadow-elegant-lg'>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className='hidden md:inline text-base font-semibold'>{user.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{user.name}</p>
                    <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                    <p className='text-xs font-semibold text-primary capitalize'>{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className='flex cursor-pointer items-center'>
                    <LayoutDashboard className='mr-2 h-4 w-4' />
                    <span>Dasbor</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === UserRole.CUSTOMER && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href='/customer/orders' className='flex cursor-pointer items-center'>
                        <ShoppingBag className='mr-2 h-4 w-4' />
                        <span>Pesanan Saya</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/customer/coupons' className='flex cursor-pointer items-center'>
                        <Store className='mr-2 h-4 w-4' />
                        <span>Kupon Saya</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`${getDashboardLink()}/profile`} className='flex cursor-pointer items-center'>
                    <User className='mr-2 h-4 w-4' />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='cursor-pointer text-destructive'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant='ghost' asChild className='h-10 px-5 text-sm font-semibold rounded-xl hover:bg-muted/50 transition-all duration-300'>
                <Link href='/login'>Masuk</Link>
              </Button>
              <Button asChild className='h-10 px-5 text-sm font-semibold rounded-xl shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'>
                <Link href='/register'>Daftar</Link>
              </Button>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className='md:hidden px-4 py-4'>
            {/* Navigation Links - Only show when NOT authenticated */}
            {!isAuthenticated && (
              <>
                <nav className='space-y-3 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 rounded-xl p-4'>
                  <Link
                    href='/deals'
                    onClick={closeMobileMenu}
                    className='flex items-center justify-center text-base font-medium transition-colors hover:text-primary'
                  >
                    Promo
                  </Link>
                  <Link
                    href='/merchants'
                    onClick={closeMobileMenu}
                    className='flex items-center justify-center text-base font-medium transition-colors hover:text-primary'
                  >
                    Merchant
                  </Link>
                  <Link
                    href='/categories'
                    onClick={closeMobileMenu}
                    className='flex items-center justify-center text-base font-medium transition-colors hover:text-primary'
                  >
                    Kategori
                  </Link>
                </nav>

                <div className='h-px bg-border my-4' />
              </>
            )}

            {/* Auth Section */}
            {isLoading ? (
              <div className='flex items-center justify-center py-4'>
                <div className='h-10 w-10 animate-pulse rounded-full bg-gradient-muted' />
              </div>
            ) : isAuthenticated && user ? (
              <div className='space-y-3'>
                {/* User Info */}
                <div className='flex flex-col items-center gap-3 px-4 py-3 rounded-xl'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-white shadow-elegant-lg'>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-center truncate'>{user.name}</p>
                    <p className='text-xs text-muted-foreground text-center truncate'>{user.email}</p>
                    <p className='text-xs font-semibold text-primary text-center capitalize'>{user.role}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <Link
                  href={getDashboardLink()}
                  onClick={closeMobileMenu}
                  className='flex items-center justify-center gap-3 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors'
                >
                  <span className='font-medium'>Dasbor</span>
                </Link>

                {user.role === UserRole.CUSTOMER && (
                  <>
                    <Link
                      href='/customer/orders'
                      onClick={closeMobileMenu}
                      className='flex items-center justify-center gap-3 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors'
                    >
                      <span className='font-medium'>Pesanan Saya</span>
                    </Link>
                    <Link
                      href='/customer/coupons'
                      onClick={closeMobileMenu}
                      className='flex items-center justify-center gap-3 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors'
                    >
                      <span className='font-medium'>Kupon Saya</span>
                    </Link>
                  </>
                )}

                <Link
                  href={`${getDashboardLink()}/profile`}
                  onClick={closeMobileMenu}
                  className='flex items-center justify-center gap-3 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors'
                >
                  <span className='font-medium'>Profil</span>
                </Link>

                <div className='h-px bg-border my-2' />

                <button
                  onClick={() => {
                    closeMobileMenu()
                    logout()
                  }}
                  className='flex items-center justify-center gap-3 px-2 py-3 rounded-xl hover:bg-muted/50 transition-colors text-destructive w-full text-left'
                >
                  <span className='font-medium'>Keluar</span>
                </button>
              </div>
            ) : (
              <div className='flex flex-col space-y-2'>
                <Button variant='ghost' asChild className='w-full h-11 font-semibold rounded-xl hover:bg-muted/50'>
                  <Link href='/login' onClick={closeMobileMenu}>Masuk</Link>
                </Button>
                <Button asChild className='w-full h-11 font-semibold rounded-xl shadow-elegant-lg'>
                  <Link href='/register' onClick={closeMobileMenu}>Daftar</Link>
                </Button>
              </div>
            )}
        </div>
      )}
    </header>
  )
}
