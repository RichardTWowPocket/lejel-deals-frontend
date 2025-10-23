import Link from 'next/link'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      <div className='container mx-auto px-4 py-8'>
        <nav className='mb-8 flex items-center gap-4 text-sm text-muted-foreground'>
          <Link href='/' className='hover:text-foreground'>Beranda</Link>
          <span>/</span>
          <span className='text-foreground font-semibold'>Akun Saya</span>
        </nav>
        {children}
      </div>
    </div>
  )
}


