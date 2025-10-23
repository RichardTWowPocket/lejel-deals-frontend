'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useDeals } from '@/hooks/use-deals'
import { DealCard } from '@/components/deal/deal-card'
import { DealCardSkeleton } from '@/components/deal/deal-card-skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { DealFilters, DealStatus } from '@/types/deal'

export default function DealsPage() {
  const [filters, setFilters] = useState<DealFilters>({
    page: 1,
    limit: 12,
    status: DealStatus.ACTIVE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const [searchInput, setSearchInput] = useState('')
  const { data, isLoading, error } = useDeals(filters)
  
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5'>
        {/* Background decoration */}
        <div className='absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl' />
        <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl' />
        
        <div className='container relative mx-auto px-4 py-16'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl'>
              <span className='text-gradient-primary'>Temukan Promo Menarik</span>
            </h1>
            <p className='mb-10 text-xl text-muted-foreground sm:text-2xl'>
              Dapatkan diskon eksklusif dari restoran dan merchant favorit Anda
            </p>

            {/* Enhanced Search Bar */}
            <div className='mx-auto max-w-2xl'>
              <div className='relative flex gap-3'>
                <div className='relative flex-1'>
                  <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Cari promo, restoran, atau kategori...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className='h-14 pl-12 pr-4 text-lg border-2 shadow-elegant-lg focus:shadow-elegant-xl transition-all duration-300'
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  size='lg' 
                  className='h-14 px-8 text-lg shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
                >
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-4 py-12'>
        {/* Enhanced Filters Bar */}
        <Card className='mb-12 p-6 shadow-elegant border-border/50 bg-card/50 backdrop-blur-sm'>
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <SlidersHorizontal className='h-5 w-5 text-primary' />
              </div>
              <div>
                <span className='text-2xl font-bold text-gradient-primary'>
                  {data?.pagination?.total || 0}
                </span>
                <span className='ml-2 text-lg text-muted-foreground'>promo tersedia</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <Select onValueChange={handleSortChange} defaultValue='createdAt-desc'>
                <SelectTrigger className='h-12 w-[200px] border-2 shadow-elegant hover:shadow-elegant-lg transition-all duration-300'>
                  <SelectValue placeholder='Urutkan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdAt-desc'>Terbaru</SelectItem>
                  <SelectItem value='createdAt-asc'>Terlama</SelectItem>
                  <SelectItem value='discountedPrice-asc'>Harga: Termurah</SelectItem>
                  <SelectItem value='discountedPrice-desc'>Harga: Termahal</SelectItem>
                  <SelectItem value='discountPercentage-desc'>Diskon Tertinggi</SelectItem>
                  <SelectItem value='popularity-desc'>Paling Populer</SelectItem>
                </SelectContent>
              </Select>

              <Button variant='outline' className='h-12 gap-2 border-2 shadow-elegant hover:shadow-elegant-lg transition-all duration-300'>
                <SlidersHorizontal className='h-4 w-4' />
                Filter Lainnya
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Error State */}
        {error && (
          <Card className='border-destructive/50 bg-gradient-to-br from-destructive/5 to-destructive/10 p-16 text-center shadow-elegant-lg'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/30 shadow-elegant'>
              <svg
                className='h-10 w-10 text-destructive'
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
            <h3 className='mb-4 text-3xl font-bold text-destructive'>Gagal Memuat Promo</h3>
            <p className='mb-6 text-lg text-muted-foreground'>
              Kami mengalami kendala terhubung ke server. Kemungkinan penyebab:
            </p>
            <ul className='mb-8 space-y-3 text-left text-muted-foreground max-w-md mx-auto'>
              <li className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-destructive' />
                Server backend belum berjalan
              </li>
              <li className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-destructive' />
                Database belum diisi data promo
              </li>
              <li className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-destructive' />
                Kendala koneksi jaringan
              </li>
            </ul>
            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <Button 
                onClick={() => window.location.reload()} 
                variant='default' 
                size='lg'
                className='h-12 px-8 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
              >
                Coba Lagi
              </Button>
              <Button 
                onClick={() => (window.location.href = '/')} 
                variant='outline' 
                size='lg'
                className='h-12 px-8 border-2 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
              >
                Ke Beranda
              </Button>
            </div>
            <p className='mt-6 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg'>
              💡 Pastikan backend berjalan di http://localhost:3000
            </p>
          </Card>
        )}

        {/* Enhanced Loading State */}
        {isLoading && (
          <div className='space-y-8'>
            <div className='text-center'>
              <div className='inline-flex items-center gap-3 text-lg text-muted-foreground'>
                <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                Loading amazing deals...
              </div>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Deals Grid */}
        {!isLoading && data && data.deals && (
          <>
            {data.deals.length === 0 ? (
              <Card className='border-2 border-dashed border-primary/20 p-16 text-center shadow-elegant-lg bg-gradient-to-br from-muted/20 to-muted/40'>
                <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-elegant'>
                  <Search className='h-12 w-12 text-primary' />
                </div>
                <h3 className='mb-4 text-3xl font-bold text-gradient-primary'>Belum Ada Promo</h3>
                <p className='mb-8 text-lg text-muted-foreground max-w-md mx-auto'>
                  {filters.search
                    ? 'Kami tidak menemukan promo yang cocok dengan pencarian Anda. Coba kata kunci lain.'
                    : 'Promo akan muncul di sini setelah merchant menambahkannya. Nantikan segera!'}
                </p>
                <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                  {filters.search && (
                    <Button
                      onClick={() => {
                        setSearchInput('')
                        setFilters((prev) => ({ ...prev, search: undefined }))
                      }}
                      size='lg'
                      className='h-12 px-8 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
                    >
                      Hapus Pencarian
                    </Button>
                  )}
                  <Button 
                    variant='outline' 
                    onClick={() => (window.location.href = '/')}
                    size='lg'
                    className='h-12 px-8 border-2 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
                  >
                    Telusuri Kategori
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {data.deals.map((deal: any) => (
                    <div key={deal.id} className='animate-fade-in'>
                      <DealCard deal={deal} />
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {data?.pagination?.totalPages && data.pagination.totalPages > 1 && (
                  <div className='mt-16 flex items-center justify-center gap-4'>
                    <Button
                      variant='outline'
                      disabled={filters.page === 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
                      className='h-12 px-6 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300 disabled:opacity-50'
                    >
                      Sebelumnya
                    </Button>
                    <div className='flex items-center gap-2 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-elegant'>
                      <span className='text-lg font-semibold text-gradient-primary'>
                        {filters.page}
                      </span>
                      <span className='text-muted-foreground'>dari</span>
                      <span className='text-lg font-semibold text-gradient-secondary'>
                        {data.pagination.totalPages}
                      </span>
                    </div>
                    <Button
                      variant='outline'
                      disabled={filters.page === data.pagination.totalPages}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
                      className='h-12 px-6 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300 disabled:opacity-50'
                    >
                      Berikutnya
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

