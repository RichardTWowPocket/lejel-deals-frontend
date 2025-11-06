'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { useDeals } from '@/hooks/use-deals'
import { useCategories } from '@/hooks/use-categories'
import { useTimeOffset } from '@/hooks/use-server-time'
import { DealCardEnhanced } from '@/components/deal/deal-card-enhanced'
import { DealCardSkeleton } from '@/components/deal/deal-card-skeleton'
import { PersonalizationChips, PersonalizationFilter } from '@/components/deal/personalization-chips'
import { InfiniteScrollObserver } from '@/components/deal/infinite-scroll-observer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DealFilters, DealStatus } from '@/types/deal'
import { cn } from '@/lib/utils'

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
  const [showFilters, setShowFilters] = useState(false)
  
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
      <div className='min-h-screen bg-background'>
        {/* Hero Search Section */}
        <div className='border-b bg-gradient-to-b from-primary/5 via-background to-background'>
          <div className='container mx-auto px-4 py-8 md:py-12'>
            <div className='max-w-4xl mx-auto space-y-6'>
              {/* Title */}
              <div className='text-center space-y-2'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                  Discover Amazing Deals
                </h1>
                <p className='text-muted-foreground text-sm md:text-base'>
                  Find the best discounts and promotions from your favorite merchants
                </p>
              </div>

              {/* Search Bar */}
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='text'
                  placeholder='Search deals, restaurants, or categories...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className='h-14 pl-12 pr-28 text-base border-2 focus:border-primary'
                />
                <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-10 gap-2'
                      >
                        <SlidersHorizontal className='h-4 w-4' />
                        Filters
                        {hasActiveFilters && (
                          <Badge variant='secondary' className='ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs'>
                            {[
                              filters.search,
                              filters.categoryId,
                              filters.minPrice,
                              filters.maxPrice,
                              activePersonalization,
                            ].filter(Boolean).length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto'>
                      <SheetHeader>
                        <SheetTitle>Filter Deals</SheetTitle>
                        <SheetDescription>
                          Narrow down your search to find exactly what you're looking for
                        </SheetDescription>
                      </SheetHeader>
                      <div className='mt-6 space-y-6'>
                        {/* Clear Filters */}
                        {hasActiveFilters && (
                          <Button
                            variant='outline'
                            onClick={clearFilters}
                            className='w-full gap-2'
                          >
                            <X className='h-4 w-4' />
                            Clear All Filters
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button
                    onClick={handleSearch}
                    size='sm'
                    className='h-10 px-6'
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Active filters:</span>
                  {filters.search && (
                    <Badge variant='secondary' className='gap-1'>
                      Search: {filters.search}
                      <button
                        onClick={() => {
                          setSearchInput('')
                          setFilters((prev) => ({ ...prev, search: undefined }))
                        }}
                        className='ml-1 hover:bg-destructive/20 rounded-full p-0.5'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  )}
                  {filters.categoryId && (
                    <Badge variant='secondary' className='gap-1'>
                      {categoryItems.find(c => c.id === filters.categoryId)?.name || 'Category'}
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className='ml-1 hover:bg-destructive/20 rounded-full p-0.5'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant='secondary' className='gap-1'>
                      Price: {getPriceRangeValue(filters.minPrice, filters.maxPrice)}
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }))}
                        className='ml-1 hover:bg-destructive/20 rounded-full p-0.5'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personalization Chips */}
        <div className='bg-muted/30'>
          <div className='container mx-auto px-4 py-3'>
            <PersonalizationChips
              activeFilter={activePersonalization}
              onFilterChange={handlePersonalizationChange}
            />
          </div>
        </div>

        {/* Category and Price Filters */}
        <div className='bg-background'>
          <div className='container mx-auto px-4 py-3'>
            <div className='flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto'>
              {/* Category Dropdown */}
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => handleCategoryChange(value === 'all' ? null : value)}
              >
                <SelectTrigger className='h-11 w-full sm:w-[250px]'>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>
                    <div className='flex items-center gap-2'>
                      <span>🎯</span>
                      <span>All Categories</span>
                    </div>
                  </SelectItem>
                  {categoryItems.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className='flex items-center gap-2'>
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Dropdown */}
              <Select
                value={getPriceRangeValue(filters.minPrice, filters.maxPrice)}
                onValueChange={handlePriceRangeChange}
              >
                <SelectTrigger className='h-11 w-full sm:w-[250px]'>
                  <SelectValue placeholder='All prices' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All prices</SelectItem>
                  <SelectItem value='0-20000'>Rp 0 - 20.000</SelectItem>
                  <SelectItem value='20000-50000'>Rp 20.000 - 50.000</SelectItem>
                  <SelectItem value='50000-100000'>Rp 50.000 - 100.000</SelectItem>
                  <SelectItem value='100000+'>Rp 100.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='container mx-auto px-4 py-6 md:py-8'>
          {/* Results Header */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold'>
                {data?.pagination?.total ? (
                  <>
                    <span className='text-primary'>{data.pagination.total}</span> deals found
                  </>
                ) : (
                  'Browse Deals'
                )}
              </h2>
              {filters.search && (
                <p className='text-sm text-muted-foreground'>
                  Results for &quot;{filters.search}&quot;
                </p>
              )}
            </div>
            <Select
              onValueChange={handleSortChange}
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            >
              <SelectTrigger className='w-full sm:w-[200px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt-desc'>Newest First</SelectItem>
                <SelectItem value='createdAt-asc'>Oldest First</SelectItem>
                <SelectItem value='discountedPrice-asc'>Price: Low to High</SelectItem>
                <SelectItem value='discountedPrice-desc'>Price: High to Low</SelectItem>
                <SelectItem value='discountPercentage-desc'>Highest Discount</SelectItem>
                <SelectItem value='popularity-desc'>Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error State */}
          {error && (
            <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
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
                <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
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
                      <div className='flex items-center gap-2 px-4 py-2 text-sm'>
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
