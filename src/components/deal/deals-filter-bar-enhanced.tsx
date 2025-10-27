'use client'

import { useState } from 'react'
import { X, ChevronDown, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DealFilters, DealStatus } from '@/types/deal'
import { cn } from '@/lib/utils'

interface DealsFilterBarEnhancedProps {
  filters: DealFilters
  onFiltersChange: (filters: DealFilters) => void
  totalDeals?: number
}

export function DealsFilterBarEnhanced({ filters, onFiltersChange, totalDeals = 0 }: DealsFilterBarEnhancedProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    })
  }

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId === 'all' ? undefined : categoryId,
      page: 1,
    })
  }

  const handlePriceRangeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined, page: 1 })
    } else if (value === '0-20000') {
      onFiltersChange({ ...filters, minPrice: 0, maxPrice: 20000, page: 1 })
    } else if (value === '20000-50000') {
      onFiltersChange({ ...filters, minPrice: 20000, maxPrice: 50000, page: 1 })
    } else if (value === '50000-100000') {
      onFiltersChange({ ...filters, minPrice: 50000, maxPrice: 100000, page: 1 })
    } else if (value === '100000+') {
      onFiltersChange({ ...filters, minPrice: 100000, maxPrice: undefined, page: 1 })
    }
  }

  const handleCityChange = (city: string) => {
    if (city === 'all') {
      onFiltersChange({
        ...filters,
        // city: undefined, // Will be implemented when backend supports it
        page: 1,
      })
    }
  }

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 12,
      status: DealStatus.ACTIVE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  const hasActiveFilters = filters.categoryId || filters.minPrice || filters.maxPrice

  function getPriceRangeValue(minPrice?: number, maxPrice?: number): string {
    if (!minPrice && !maxPrice) return 'all'
    if (minPrice === 0 && maxPrice === 20000) return '0-20000'
    if (minPrice === 20000 && maxPrice === 50000) return '20000-50000'
    if (minPrice === 50000 && maxPrice === 100000) return '50000-100000'
    if (minPrice === 100000 && !maxPrice) return '100000+'
    return 'custom'
  }

  return (
    <Card className='mb-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-elegant'>
      {/* Main Bar - Compact Single Row */}
      <div className='px-4 py-3'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          {/* Left: Results Count */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              Menampilkan
            </span>
            <span className='text-xl font-bold text-foreground'>
              {totalDeals}
            </span>
            <span className='text-sm text-muted-foreground'>
              promo
            </span>
          </div>

          {/* Right: Sort Only (Separate from Filters) */}
          <div className='flex items-center gap-3'>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>Urutkan:</span>
            <Select 
              onValueChange={handleSortChange} 
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            >
              <SelectTrigger className='h-9 w-[180px]'>
                <SelectValue placeholder='Urutkan' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt-desc'>Terbaru</SelectItem>
                <SelectItem value='createdAt-asc'>Terlama</SelectItem>
                <SelectItem value='discountedPrice-asc'>Termurah</SelectItem>
                <SelectItem value='discountedPrice-desc'>Termahal</SelectItem>
                <SelectItem value='discountPercentage-desc'>Diskon Tertinggi</SelectItem>
                <SelectItem value='popularity-desc'>Paling Populer</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button 
              variant='outline' 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className='h-9 gap-2'
            >
              <Filter className='h-4 w-4' />
              {showAdvancedFilters ? 'Tutup' : 'Filter'}
              {hasActiveFilters && (
                <Badge variant='default' className='ml-1 px-1.5 py-0 text-xs'>
                  {[filters.categoryId, filters.minPrice, filters.maxPrice].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant='ghost' 
                size='sm'
                onClick={clearFilters}
                className='h-9 gap-1 text-muted-foreground hover:text-foreground'
              >
                <X className='h-4 w-4' />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters - Expanded */}
        {showAdvancedFilters && (
          <div className='mt-4 border-t pt-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {/* Category Filter */}
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                  Kategori
                </label>
                <Select 
                  value={filters.categoryId || 'all'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className='h-10'>
                    <SelectValue placeholder='Semua kategori' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua kategori</SelectItem>
                    <SelectItem value='food'>🍽️ Food & Beverage</SelectItem>
                    <SelectItem value='shopping'>🛍️ Shopping</SelectItem>
                    <SelectItem value='entertainment'>🎬 Entertainment</SelectItem>
                    <SelectItem value='beauty'>💄 Health & Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                  Rentang Harga
                </label>
                <Select 
                  value={getPriceRangeValue(filters.minPrice, filters.maxPrice)} 
                  onValueChange={handlePriceRangeChange}
                >
                  <SelectTrigger className='h-10'>
                    <SelectValue placeholder='Semua harga' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua harga</SelectItem>
                    <SelectItem value='0-20000'>Rp 0 - 20.000</SelectItem>
                    <SelectItem value='20000-50000'>Rp 20.000 - 50.000</SelectItem>
                    <SelectItem value='50000-100000'>Rp 50.000 - 100.000</SelectItem>
                    <SelectItem value='100000+'>Rp 100.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                  Kota
                </label>
                <Select 
                  value='all' 
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className='h-10'>
                    <SelectValue placeholder='Semua kota' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua kota</SelectItem>
                    <SelectItem value='jakarta'>Jakarta</SelectItem>
                    <SelectItem value='bandung'>Bandung</SelectItem>
                    <SelectItem value='surabaya'>Surabaya</SelectItem>
                    <SelectItem value='yogyakarta'>Yogyakarta</SelectItem>
                    <SelectItem value='bali'>Bali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

