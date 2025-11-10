'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { DealStatus } from '@/types/deal'
import type { DealFilters } from '@/types/deal'
import { useCategories } from '@/hooks/use-categories'
import { cn } from '@/lib/utils'

interface DealFiltersProps {
  className?: string
}

/**
 * Deal Filters Component
 * 
 * Filter bar for deals with status, category, and search filters.
 * Filters are synced with URL for shareable/bookmarkable links.
 * 
 * @example
 * ```tsx
 * <DealFilters />
 * ```
 */
export function DealFilters({ className }: DealFiltersProps) {
  const { filters, updateFilters, clearFilters } = useMerchantFilters<DealFilters>({
    defaults: {
      page: 1,
      limit: 10,
      status: undefined,
      categoryId: undefined,
      search: undefined,
    },
  })

  const { data: categoriesData } = useCategories()

  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const hasActiveFilters =
    filters.status || filters.categoryId || filters.search

  return (
    <div className={cn(className)}>
      {/* Search Input */}
      <div className="relative mt-4 md:mt-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search deals..."
          value={filters.search || ''}
          onChange={(e) =>
            updateFilters({ search: e.target.value || undefined, page: 1 })
          }
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              updateFilters({ status: value === 'all' ? undefined : (value as DealStatus), page: 1 })
            }
          >
            <SelectTrigger className="h-8 px-3 text-xs whitespace-nowrap min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[100]">
              <SelectItem value="all" className="text-xs">
                Semua Status
              </SelectItem>
              <SelectItem value={DealStatus.ACTIVE} className="text-xs">
                Aktif
              </SelectItem>
              <SelectItem value={DealStatus.PAUSED} className="text-xs">
                Dijeda
              </SelectItem>
              <SelectItem value={DealStatus.DRAFT} className="text-xs">
                Draft
              </SelectItem>
              <SelectItem value={DealStatus.EXPIRED} className="text-xs">
                Kedaluwarsa
              </SelectItem>
              <SelectItem value={DealStatus.SOLD_OUT} className="text-xs">
                Habis Terjual
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) =>
              updateFilters({ categoryId: value === 'all' ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger className="h-8 px-3 text-xs whitespace-nowrap min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[100]">
              <SelectItem value="all" className="text-xs">
                Semua Kategori
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="text-xs">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-3 text-xs whitespace-nowrap flex-shrink-0"
          >
            <X className="mr-2 h-3.5 w-3.5" />
            Reset filter
          </Button>
        )}
      </div>
    </div>
  )
}


