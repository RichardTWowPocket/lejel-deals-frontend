'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Media } from '@/types/media'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Eye, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface MediaItemProps {
  media: Media
  isSelected?: boolean
  onSelect?: (mediaId: string) => void
  onDelete?: (mediaId: string) => void
  onView?: (media: Media) => void
  showSelection?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function MediaItem({
  media,
  isSelected = false,
  onSelect,
  onDelete,
  onView,
  showSelection = false,
}: MediaItemProps) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    if (showSelection && onSelect) {
      onSelect(media.id)
    } else if (onView) {
      onView(media)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(media.id)
    }
  }

  const isImage = media.mimeType.startsWith('image/')
  const hasUsage = media.usage && media.usage.length > 0

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary',
        showSelection && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* Image Preview */}
        <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
          {isImage && !imageError ? (
            <Image
              src={media.url}
              alt={media.originalName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onError={() => setImageError(true)}
              unoptimized={media.url.startsWith('http://localhost') || media.url.startsWith('data:')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Selection Indicator */}
          {showSelection && (
            <div className="absolute top-2 left-2">
              <div
                className={cn(
                  'h-5 w-5 rounded border-2 flex items-center justify-center',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground'
                )}
              >
                {isSelected && (
                  <svg
                    className="h-3 w-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Usage Indicator */}
          {hasUsage && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {media.usage?.length} {media.usage?.length === 1 ? 'use' : 'uses'}
              </Badge>
            </div>
          )}

          {/* Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            {!showSelection && onView && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(media)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="p-3 space-y-1">
          <p className="text-sm font-medium truncate" title={media.originalName}>
            {media.originalName}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatFileSize(media.size)}</span>
            <span>{formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

