'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { MediaLibrary } from '@/components/merchant/media/media-library'
import { useMerchantMedia, useDeleteMedia, useBulkDeleteMedia } from '@/hooks/merchant'
import { ErrorDisplay, PageHeaderSkeleton, MediaGridSkeleton } from '@/components/merchant/shared'
import { Button } from '@/components/ui/button'
import { Upload, ImageIcon, Grid3x3, CheckSquare } from 'lucide-react'
import { Media } from '@/types/media'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'

// Lazy load modals (only load when opened)
const MediaUploadModal = dynamic(
  () => import('@/components/merchant/media/media-upload-modal').then((mod) => ({ default: mod.MediaUploadModal })),
  { ssr: false }
)

const MediaDetails = dynamic(
  () => import('@/components/merchant/media/media-details').then((mod) => ({ default: mod.MediaDetails })),
  { ssr: false }
)

export default function MediaPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showSelection, setShowSelection] = useState(false)

  const { filters, updateFilters } = useMerchantFilters<{
    page?: number
    limit?: number
    search?: string
    mimeType?: string
    sortBy?: string
    sortOrder?: string
  }>()

  const {
    data: mediaData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMerchantMedia({
    page: filters.page || 1,
    limit: filters.limit || 24,
    search: filters.search,
    mimeType: filters.mimeType,
    sortBy: filters.sortBy as 'createdAt' | 'size' | 'originalName',
    sortOrder: filters.sortOrder as 'asc' | 'desc',
  })

  const deleteMedia = useDeleteMedia()
  const bulkDeleteMedia = useBulkDeleteMedia()

  const handleSelect = (mediaId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(mediaId)) {
        next.delete(mediaId)
      } else {
        next.add(mediaId)
      }
      return next
    })
  }

  const handleDelete = (mediaId: string) => {
    deleteMedia.mutate(mediaId, {
      onSuccess: () => {
        setSelectedIds((prev) => {
          const next = new Set(prev)
          next.delete(mediaId)
          return next
        })
        refetch()
      },
    })
  }

  const handleBulkDelete = (ids: string[]) => {
    bulkDeleteMedia.mutate(ids, {
      onSuccess: () => {
        setSelectedIds(new Set())
        refetch()
      },
    })
  }

  const handleView = (media: Media) => {
    setSelectedMedia(media)
    setIsDetailsOpen(true)
  }

  const handleDeleteFromDetails = (mediaId: string) => {
    handleDelete(mediaId)
    setIsDetailsOpen(false)
    setSelectedMedia(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <MediaGridSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Failed to load media"
        description="We couldn't retrieve your media library. Please try again."
      />
    )
  }

  const media = mediaData?.data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Media Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your images and media files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showSelection ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setShowSelection(!showSelection)
              setSelectedIds(new Set())
            }}
          >
            {showSelection ? (
              <>
                <CheckSquare className="mr-2 h-4 w-4" />
                Selection Mode
              </>
            ) : (
              <>
                <Grid3x3 className="mr-2 h-4 w-4" />
                Select Files
              </>
            )}
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Media Library */}
      <MediaLibrary
        media={media}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onView={handleView}
        showSelection={showSelection}
        onBulkDelete={handleBulkDelete}
      />

      {/* Pagination */}
      {mediaData?.pagination && mediaData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = (filters.page || 1) - 1
              if (newPage >= 1) {
                updateFilters({ page: newPage })
              }
            }}
            disabled={(filters.page || 1) === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {filters.page || 1} of {mediaData.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = (filters.page || 1) + 1
              if (newPage <= mediaData.pagination.totalPages) {
                updateFilters({ page: newPage })
              }
            }}
            disabled={(filters.page || 1) === mediaData.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <MediaUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />

      {/* Details Modal */}
      <MediaDetails
        media={selectedMedia}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onDelete={handleDeleteFromDetails}
      />
    </div>
  )
}

