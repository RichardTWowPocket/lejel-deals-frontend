'use client'

import { Media } from '@/types/media'
import { MediaItem } from './media-item'
import { EmptyState } from '@/components/merchant/shared'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaGridProps {
  media: Media[]
  selectedIds?: Set<string>
  onSelect?: (mediaId: string) => void
  onDelete?: (mediaId: string) => void
  onView?: (media: Media) => void
  showSelection?: boolean
  className?: string
}

export function MediaGrid({
  media,
  selectedIds = new Set(),
  onSelect,
  onDelete,
  onView,
  showSelection = false,
  className,
}: MediaGridProps) {
  if (media.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No media files"
        description="Upload your first image to get started."
      />
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
        className
      )}
    >
      {media.map((item) => (
        <MediaItem
          key={item.id}
          media={item}
          isSelected={selectedIds.has(item.id)}
          onSelect={onSelect}
          onDelete={onDelete}
          onView={onView}
          showSelection={showSelection}
        />
      ))}
    </div>
  )
}



