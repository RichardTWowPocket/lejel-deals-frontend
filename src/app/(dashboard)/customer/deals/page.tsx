'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { useDeals } from '@/hooks/use-deals'
import { useCategories } from '@/hooks/use-categories'
import { useTimeOffset } from '@/hooks/use-server-time'
import { DealCardEnhanced } from '@/components/deal/deal-card-enhanced'
import { DealCardSkeleton } from '@/components/deal/deal-card-skeleton'
import { PersonalizationFilter } from '@/components/deal/personalization-chips'
import { InfiniteScrollObserver } from '@/components/deal/infinite-scroll-observer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  // Transform categories for scroller
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
      setFilters({
        page: 1,
        limit: 12,
        status: DealStatus.ACTIVE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      return
    }

    switch (filter) {
      case 'ending-soon':
        setFilters({
          ...filters,
          sortBy: 'createdAt',
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
      case 'for-you':
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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setFilters({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    })
  }

  const handlePriceRangeChange = (value: string) => {
    if (value === 'all') {
      setFilters({ ...filters, minPrice: undefined, maxPrice: undefined, page: 1 })
    } else if (value === '0-20000') {
      setFilters({ ...filters, minPrice: 0, maxPrice: 20000, page: 1 })
    } else if (value === '20000-50000') {
      setFilters({ ...filters, minPrice: 20000, maxPrice: 50000, page: 1 })
    } else if (value === '50000-100000') {
      setFilters({ ...filters, minPrice: 50000, maxPrice: 100000, page: 1 })
    } else if (value === '100000+') {
      setFilters({ ...filters, minPrice: 100000, maxPrice: undefined, page: 1 })
    }
  }

  const clearFilters = () => {
    setSearchInput('')
    setActivePersonalization(null)
    setFilters({
      page: 1,
      limit: 12,
      status: DealStatus.ACTIVE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  const hasActiveFilters = filters.search || filters.categoryId || filters.minPrice || filters.maxPrice || activePersonalization

  const getPriceRangeValue = (minPrice?: number, maxPrice?: number): string => {
    if (!minPrice && !maxPrice) return 'all'
    if (minPrice === 0 && maxPrice === 20000) return '0-20000'
    if (minPrice === 20000 && maxPrice === 50000) return '20000-50000'
    if (minPrice === 50000 && maxPrice === 100000) return '50000-100000'
    if (minPrice === 100000 && !maxPrice) return '100000+'
    return 'all'
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div>
        {/* Hero Search Section */}
        <div>
          <div>
            {/* Title */}
            <div className='hidden md:block mb-6'>
              <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                Temukan Promo Menarik
              </h1>
              <p className='text-muted-foreground text-sm md:text-base'>
                Dapatkan diskon dan promosi terbaik dari merchant favorit Anda
              </p>
            </div>

            {/* Search Bar */}
            <div className='relative mt-4 md:mt-6'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search deals, restaurants, or categories...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className='pl-10'
              />
            </div>

          </div>
        </div>

        {/* Personalization Chips, Filters, and Sort */}
        <div className='flex flex-wrap items-center justify-between py-1'>
          {/* Personalization Chips */}
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-1'>
            <Button
              variant={activePersonalization === 'for-you' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePersonalizationChange(activePersonalization === 'for-you' ? null : 'for-you')}
              className='whitespace-nowrap h-8 px-3 text-xs'
            >
              ✨ For you
            </Button>
            <Button
              variant={activePersonalization === 'near-me' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePersonalizationChange(activePersonalization === 'near-me' ? null : 'near-me')}
              className='whitespace-nowrap h-8 px-3 text-xs'
            >
              📍 Near me
            </Button>
            <Button
              variant={activePersonalization === 'ending-soon' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePersonalizationChange(activePersonalization === 'ending-soon' ? null : 'ending-soon')}
              className='whitespace-nowrap h-8 px-3 text-xs'
            >
              ⏰ Ending soon
            </Button>
            <Button
              variant={activePersonalization === 'popular' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePersonalizationChange(activePersonalization === 'popular' ? null : 'popular')}
              className='whitespace-nowrap h-8 px-3 text-xs'
            >
              📈 Popular
            </Button>
            <Button
              variant={activePersonalization === 'new' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePersonalizationChange(activePersonalization === 'new' ? null : 'new')}
              className='whitespace-nowrap h-8 px-3 text-xs'
            >
              🏷️ New
            </Button>
          </div>

          {/* Filters and Sort */}
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-1'>
            <Select
              value={filters.categoryId || 'all'}
              onValueChange={(value) => handleCategoryChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className='h-8 px-3 text-xs whitespace-nowrap'>
                <SelectValue placeholder='All Categories' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-[100]'>
                <SelectItem value='all' className='text-xs'>All Categories</SelectItem>
                {categoryItems.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className='text-xs'>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={getPriceRangeValue(filters.minPrice, filters.maxPrice)}
              onValueChange={handlePriceRangeChange}
            >
              <SelectTrigger className='h-8 px-3 text-xs whitespace-nowrap'>
                <SelectValue placeholder='All prices' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-[100]'>
                <SelectItem value='all' className='text-xs'>All prices</SelectItem>
                <SelectItem value='0-20000' className='text-xs'>Rp 0 - 20.000</SelectItem>
                <SelectItem value='20000-50000' className='text-xs'>Rp 20.000 - 50.000</SelectItem>
                <SelectItem value='50000-100000' className='text-xs'>Rp 50.000 - 100.000</SelectItem>
                <SelectItem value='100000+' className='text-xs'>Rp 100.000+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleSortChange}
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            >
              <SelectTrigger className='h-8 px-3 text-xs whitespace-nowrap'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-[100]'>
                <SelectItem value='createdAt-desc' className='text-xs'>Newest First</SelectItem>
                <SelectItem value='createdAt-asc' className='text-xs'>Oldest First</SelectItem>
                <SelectItem value='discountedPrice-asc' className='text-xs'>Price: Low to High</SelectItem>
                <SelectItem value='discountedPrice-desc' className='text-xs'>Price: High to Low</SelectItem>
                <SelectItem value='discountPercentage-desc' className='text-xs'>Highest Discount</SelectItem>
                <SelectItem value='popularity-desc' className='text-xs'>Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Results Header */}
          <div className='mb-6'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold'>
              {data?.pagination?.total ? (
                <>
                  <span className='text-primary'>{data.pagination.total}</span> deals found
                </>
              ) : (
                'Browse Deals'
              )}
            </h2>
            {filters.search && (
              <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                Results for &quot;{filters.search}&quot;
              </p>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
                <X className='h-8 w-8 text-destructive' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Failed to load deals</h3>
              <p className='mb-6 text-sm text-muted-foreground max-w-md'>
                We couldn't connect to the server. Please check your connection and try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
                <div className='flex flex-col items-center justify-center py-16 text-center mt-6'>
                  <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                    <Search className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <h3 className='mb-2 text-xl font-semibold'>No deals found</h3>
                  <p className='mb-6 text-sm text-muted-foreground max-w-md'>
                    {hasActiveFilters
                      ? "We couldn't find any deals matching your filters. Try adjusting your search criteria."
                      : "There are no active deals at the moment. Check back soon for new promotions!"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant='outline' onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {data.deals.map((deal: any) => (
                      <DealCardEnhanced key={deal.id} deal={deal} timeOffset={timeOffset} />
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
                    <div className='mt-12 flex items-center justify-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={filters.page === 1}
                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                      >
                        Previous
                      </Button>
                      <div className='flex items-center gap-2 py-2 text-sm'>
                        <span className='font-medium'>Page</span>
                        <span className='font-semibold'>{filters.page || 1}</span>
                        <span className='text-muted-foreground'>of</span>
                        <span className='font-semibold'>{data.pagination.totalPages}</span>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={(filters.page || 1) === data.pagination.totalPages}
                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
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
    </ProtectedRoute>
  )
}
