import { Sidebar } from '@/components/layout/sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { DashboardNavbar } from '@/components/layout/dashboard-navbar'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Navbar */}
        <DashboardNavbar />
        
        {/* Main Content */}
        <main className='flex-1 overflow-y-auto pb-16 md:pb-0'>
          <div className='px-4 md:px-6 md:pt-6'>
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  )
}


