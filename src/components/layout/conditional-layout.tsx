'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current path is a dashboard route
  // Note: /merchant is a public page, but /merchant/* are dashboard routes
  const isDashboardRoute = pathname.startsWith('/customer') || 
                          (pathname.startsWith('/merchant/') && pathname !== '/merchant') || 
                          pathname.startsWith('/admin') ||
                          pathname.startsWith('/staff')

  if (isDashboardRoute) {
    // For dashboard routes, only render children (no header/footer)
    return <>{children}</>
  }

  // For non-dashboard routes, render with header and footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
