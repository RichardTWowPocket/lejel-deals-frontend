'use client'

import { useState } from 'react'
import { Search, Bell } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { useDeals } from '@/hooks/use-deals'
import { useCategories } from '@/hooks/use-categories'
import { useTimeOffset } from '@/hooks/use-server-time'
import { DealCardEnhanced } from '@/components/deal/deal-card-enhanced'
import { DealCardSkeleton } from '@/components/deal/deal-card-skeleton'
import { PersonalizationChips, PersonalizationFilter } from '@/components/deal/personalization-chips'
import { CategoryScroller } from '@/components/deal/category-scroller'
import { DealsFilterBarEnhanced } from '@/components/deal/deals-filter-bar-enhanced'
import { InfiniteScrollObserver } from '@/components/deal/infinite-scroll-observer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DealFilters, DealStatus } from '@/types/deal'

export default function CustomerDealsPage() {
  const [filters, setFilters] = useState<DealFilters>({
    page: 1,
    limit: 12,
    status: DealStatus.ACTIVE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const [searchInput, setSearchInput] = useState('')
  const [activePersonalization, setActivePersonalization] = useState<PersonalizationFilter | null>(null)
  
  const { data, isLoading, error } = useDeals(filters)
  const { data: categories } = useCategories()
  const timeOffset = useTimeOffset()

  // Transform categories for scroller - safely handle array
  const categoryItems = Array.isArray(categories) 
    ? categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || '📦',
        color: cat.color,
      }))
    : []

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
  }

  const handlePersonalizationChange = (filter: PersonalizationFilter | null) => {
    setActivePersonalization(filter)
    
    if (!filter) {
      // Reset to default
      setFilters({
        page: 1,
        limit: 12,
        status: DealStatus.ACTIVE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      return
    }

    // Apply personalization filters
    switch (filter) {
      case 'ending-soon':
        setFilters({
          ...filters,
          sortBy: 'createdAt', // Will sort by newest as proxy for ending soon
          sortOrder: 'asc',
          page: 1,
        })
        break
      case 'popular':
        setFilters({
          ...filters,
          sortBy: 'popularity',
          sortOrder: 'desc',
          page: 1,
        })
        break
      case 'new':
        setFilters({
          ...filters,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          page: 1,
        })
        break
      case 'near-me':
        // TODO: Implement location-based filtering
        setFilters({
          ...filters,
          page: 1,
        })
        break
      case 'for-you':
        // TODO: Implement personalized recommendations
        setFilters({
          ...filters,
          page: 1,
        })
        break
    }
  }

  const handleCategoryChange = (categoryId: string | null) => {
    setFilters({
      ...filters,
      categoryId: categoryId || undefined,
      page: 1,
    })
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='min-h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
        {/* Header Section */}
        <div className='sticky top-0 z-20 border-b bg-background/80 backdrop-blur-xl shadow-elegant'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gradient-primary'>Deals</h2>
              <div className='flex items-center gap-3'>
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <Search className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <Bell className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <section className='border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5'>
          <div className='container mx-auto px-4 py-8'>
            <div className='max-w-2xl mx-auto'>
              <div className='relative flex gap-3'>
                <div className='relative flex-1'>
                  <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Cari promo, restoran, atau kategori...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className='h-12 pl-12 pr-4 text-base border-2 shadow-elegant-lg focus:shadow-elegant-xl transition-all duration-300'
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  size='lg'
                  className='h-12 px-8 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
                >
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Personalization Chips */}
        <div className='container mx-auto px-4'>
          <PersonalizationChips
            activeFilter={activePersonalization}
            onFilterChange={handlePersonalizationChange}
          />
        </div>

        {/* Category Scroller */}
        <div className='container mx-auto px-4'>
          <CategoryScroller
            categories={categoryItems}
            selectedCategoryId={filters.categoryId}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Main Content */}
        <div className='container mx-auto px-4 py-6'>
          {/* Filter Bar */}
          <DealsFilterBarEnhanced
            filters={filters}
            onFiltersChange={setFilters}
            totalDeals={data?.pagination?.total || 0}
          />

          {/* Error State */}
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
                Kami mengalami kendala terhubung ke server.
              </p>
              <Button
                onClick={() => window.location.reload()}
                size='lg'
                className='h-12 px-8 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
              >
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className='space-y-8'>
              <div className='text-center'>
                <div className='inline-flex items-center gap-3 text-lg text-muted-foreground'>
                  <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  Memuat promo menarik...
                </div>
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <DealCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Deals Grid */}
          {!isLoading && !error && data && (
            <>
              {data.deals.length === 0 ? (
                <Card className='border-2 border-dashed border-primary/20 p-16 text-center shadow-elegant-lg bg-gradient-to-br from-muted/20 to-muted/40'>
                  <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-elegant'>
                    <Search className='h-12 w-12 text-primary' />
                  </div>
                  <h3 className='mb-4 text-3xl font-bold text-gradient-primary'>Belum Ada Promo</h3>
                  <p className='mb-8 text-lg text-muted-foreground max-w-md mx-auto'>
                    {filters.search || filters.categoryId || filters.minPrice || filters.maxPrice
                      ? 'Tidak ada deal yang cocok. Coba ubah filter.'
                      : 'Promo akan muncul di sini setelah merchant menambahkannya. Nantikan segera!'}
                  </p>
                  {(filters.search || filters.categoryId || filters.minPrice || filters.maxPrice) && (
                    <Button
                      onClick={() => {
                        setSearchInput('')
                        setFilters({
                          page: 1,
                          limit: 12,
                          status: DealStatus.ACTIVE,
                          sortBy: 'createdAt',
                          sortOrder: 'desc',
                        })
                      }}
                      size='lg'
                      className='h-12 px-8 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300'
                    >
                      Reset Filter
                    </Button>
                  )}
                </Card>
              ) : (
                <>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {data.deals.map((deal: any) => (
                      <div key={deal.id} className='animate-fade-in'>
                        <DealCardEnhanced deal={deal} timeOffset={timeOffset} />
                      </div>
                    ))}
                  </div>

                  {/* Infinite Scroll Observer */}
                  {data?.pagination?.totalPages && filters.page && filters.page < data.pagination.totalPages && (
                    <InfiniteScrollObserver
                      enabled={!isLoading}
                      onIntersect={() => {
                        if (!isLoading && filters.page && filters.page < data.pagination.totalPages) {
                          setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                        }
                      }}
                    />
                  )}

                  {/* Pagination */}
                  {data?.pagination?.totalPages && data.pagination.totalPages > 1 && (
                    <div className='mt-16 flex items-center justify-center gap-4'>
                      <Button
                        variant='outline'
                        disabled={filters.page === 1}
                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                        className='h-12 px-6 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300 disabled:opacity-50'
                      >
                        Sebelumnya
                      </Button>
                      <div className='flex items-center gap-2 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-elegant'>
                        <span className='text-lg font-semibold text-gradient-primary'>
                          {filters.page || 1}
                        </span>
                        <span className='text-muted-foreground'>dari</span>
                        <span className='text-lg font-semibold text-gradient-secondary'>
                          {data.pagination.totalPages}
                        </span>
                      </div>
                      <Button
                        variant='outline'
                        disabled={(filters.page || 1) === data.pagination.totalPages}
                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
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
    </ProtectedRoute>
  )
}
