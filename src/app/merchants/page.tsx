'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useMerchants } from '@/hooks/use-merchants'
import { MerchantCard } from '@/components/merchant'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MerchantFilters } from '@/types/merchant'

export default function MerchantsPage() {
  const [filters, setFilters] = useState<MerchantFilters>({
    page: 1,
    limit: 12,
    sortBy: 'businessName',
    sortOrder: 'asc',
  })

  const [searchInput, setSearchInput] = useState('')
  const { data, isLoading, error } = useMerchants(filters)

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5'>
        {/* Background decoration */}
        <div className='absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl md:-top-40 md:-right-40 md:h-80 md:w-80' />
        <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl md:-bottom-40 md:-left-40 md:h-80 md:w-80' />
        
        <div className='container relative mx-auto px-4 py-8 sm:py-12 md:py-16'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='mb-4 sm:mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight'>
              <span className='text-gradient-secondary'>Temukan Merchant</span>
            </h1>
            <p className='mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-xl lg:text-2xl text-muted-foreground px-4'>
              Jelajahi restoran dan bisnis terverifikasi dengan promo eksklusif
            </p>

            {/* Enhanced Search Bar */}
            <div className='mx-auto max-w-2xl px-4'>
              <div className='relative flex flex-col sm:flex-row gap-2 sm:gap-3'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Cari merchant atau lokasi...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className='h-10 sm:h-12 md:h-14 pl-9 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base md:text-lg border-2 shadow-elegant-lg focus:shadow-elegant-xl transition-all duration-300'
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  size='lg' 
                  className='h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300 w-full sm:w-auto'
                >
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10'>
        {/* Stats */}
        <div className='mb-6 sm:mb-8 text-center'>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            {data?.pagination?.total || 0} merchant terverifikasi tersedia
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Card className='border-destructive/50 bg-destructive/5 p-6 sm:p-10 md:p-12 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-destructive/10'>
              <svg
                className='h-6 w-6 sm:h-8 sm:w-8 text-destructive'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg sm:text-xl font-semibold'>Gagal Memuat Merchant</h3>
            <p className='mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground px-4'>
              Kami mengalami kendala terhubung ke server. Silakan coba lagi.
            </p>
            <div className='flex flex-col gap-2 sm:flex-row sm:justify-center px-4'>
              <Button onClick={() => window.location.reload()} variant='default' className='h-10 sm:h-11 text-sm sm:text-base w-full sm:w-auto'>
                Coba Lagi
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant='outline' className='h-10 sm:h-11 text-sm sm:text-base w-full sm:w-auto'>
                Ke Beranda
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className='overflow-hidden'>
                <Skeleton className='h-40 sm:h-48 w-full' />
                <div className='p-4 sm:p-6'>
                  <Skeleton className='mb-2 h-5 sm:h-6 w-3/4' />
                  <Skeleton className='mb-4 h-4 w-1/2' />
                  <Skeleton className='h-9 sm:h-10 w-full' />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Merchants Grid */}
        {!isLoading && data && data.merchants && (
          <>
            {data.merchants.length === 0 ? (
              <Card className='border-2 border-dashed p-8 sm:p-10 md:p-12 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20'>
                  <Search className='h-8 w-8 sm:h-10 sm:w-10 text-primary' />
                </div>
                <h3 className='mb-2 text-xl sm:text-2xl font-bold'>Belum Ada Merchant</h3>
                <p className='mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground px-4'>
                  {filters.search
                    ? 'Kami tidak menemukan merchant yang cocok dengan pencarian Anda.'
                    : 'Merchant akan tampil setelah bergabung di platform kami. Nantikan segera!'}
                </p>
                {filters.search && (
                  <Button
                    onClick={() => {
                      setSearchInput('')
                      setFilters((prev) => ({ ...prev, search: undefined }))
                    }}
                    className='h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-6'
                  >
                    Hapus Pencarian
                  </Button>
                )}
              </Card>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3'>
                  {data.merchants.map((merchant) => (
                    <MerchantCard key={merchant.id} merchant={merchant} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination?.totalPages && data.pagination.totalPages > 1 && (
                  <div className='mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2'>
                    <Button
                      variant='outline'
                      disabled={filters.page === 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
                      className='h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-6 w-full sm:w-auto'
                    >
                      Previous
                    </Button>
                    <span className='px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground'>
                      Page {filters.page} of {data?.pagination?.totalPages || 1}
                    </span>
                    <Button
                      variant='outline'
                      disabled={filters.page === (data?.pagination?.totalPages || 1)}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
                      className='h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-6 w-full sm:w-auto'
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

