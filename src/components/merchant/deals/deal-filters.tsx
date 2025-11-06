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
    <div className={`flex flex-col gap-4 md:flex-row md:items-center ${className || ''}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search deals..."
          value={filters.search || ''}
          onChange={(e) =>
            updateFilters({ search: e.target.value || undefined, page: 1 })
          }
          className="pl-9"
        />
      </div>

      {/* Status and Category Filters - Side by side on small screens, row on md+ */}
      <div className="flex flex-row gap-4 md:flex-row md:items-center">
        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            updateFilters({ status: value === 'all' ? undefined : (value as DealStatus), page: 1 })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={DealStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={DealStatus.PAUSED}>Paused</SelectItem>
            <SelectItem value={DealStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={DealStatus.EXPIRED}>Expired</SelectItem>
            <SelectItem value={DealStatus.SOLD_OUT}>Sold Out</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.categoryId || 'all'}
          onValueChange={(value) =>
            updateFilters({ categoryId: value === 'all' ? undefined : value, page: 1 })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
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
          className="w-full md:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}


