import { MerchantSidebar } from '@/components/layout/merchant-sidebar'

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      {/* Sidebar */}
      <MerchantSidebar />
      
      {/* Main Content */}
      <main className='flex-1 overflow-y-auto'>
        <div className='p-6'>
          {children}
        </div>
      </main>
    </div>
  )
}

