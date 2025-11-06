'use client'

import { useMemo } from 'react'
import { Media } from '@/types/media'
import { MediaGrid } from './media-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Trash2 } from 'lucide-react'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { EmptyState } from '@/components/merchant/shared'
import { ImageIcon } from 'lucide-react'

interface MediaLibraryProps {
  media: Media[]
  selectedIds?: Set<string>
  onSelect?: (mediaId: string) => void
  onDelete?: (mediaId: string) => void
  onView?: (media: Media) => void
  showSelection?: boolean
  onBulkDelete?: (ids: string[]) => void
}

export function MediaLibrary({
  media,
  selectedIds = new Set(),
  onSelect,
  onDelete,
  onView,
  showSelection = false,
  onBulkDelete,
}: MediaLibraryProps) {
  const { filters, updateFilters } = useMerchantFilters<{
    search?: string
    mimeType?: string
    sortBy?: string
    sortOrder?: string
  }>()

  const hasSelection = selectedIds.size > 0

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value || undefined, page: 1 })
  }

  const handleMimeTypeChange = (value: string) => {
    updateFilters({ mimeType: value === 'all' ? undefined : value, page: 1 })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 })
  }

  const handleClearFilters = () => {
    updateFilters({ search: undefined, mimeType: undefined, sortBy: undefined, sortOrder: undefined, page: 1 })
  }

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      if (confirm(`Are you sure you want to delete ${selectedIds.size} file(s)?`)) {
        onBulkDelete(Array.from(selectedIds))
      }
    }
  }

  const hasFilters = filters.search || filters.mimeType || filters.sortBy

  // Client-side filtering and sorting (backend doesn't support these yet)
  const filteredAndSortedMedia = useMemo(() => {
    let result = [...media]

    // Filter by search (filename)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((item) =>
        item.originalName.toLowerCase().includes(searchLower) ||
        item.filename.toLowerCase().includes(searchLower)
      )
    }

    // Filter by MIME type
    if (filters.mimeType) {
      result = result.filter((item) => item.mimeType === filters.mimeType)
    }

    // Sort
    const sortBy = filters.sortBy || 'createdAt'
    const sortOrder = filters.sortOrder || 'desc'

    result.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'originalName':
          aValue = a.originalName.toLowerCase()
          bValue = b.originalName.toLowerCase()
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    return result
  }, [media, filters.search, filters.mimeType, filters.sortBy, filters.sortOrder])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* MIME Type Filter */}
        <Select
          value={filters.mimeType || 'all'}
          onValueChange={handleMimeTypeChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image/jpeg">JPEG</SelectItem>
            <SelectItem value="image/png">PNG</SelectItem>
            <SelectItem value="image/webp">WebP</SelectItem>
            <SelectItem value="image/gif">GIF</SelectItem>
            <SelectItem value="image/svg+xml">SVG</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="originalName-asc">Name A-Z</SelectItem>
            <SelectItem value="originalName-desc">Name Z-A</SelectItem>
            <SelectItem value="size-desc">Largest First</SelectItem>
            <SelectItem value="size-asc">Smallest First</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Bulk Actions */}
      {showSelection && hasSelection && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">
            {selectedIds.size} file(s) selected
          </p>
          {onBulkDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>
      )}

      {/* Media Grid */}
      <MediaGrid
        media={filteredAndSortedMedia}
        selectedIds={selectedIds}
        onSelect={onSelect}
        onDelete={onDelete}
        onView={onView}
        showSelection={showSelection}
      />
    </div>
  )
}

