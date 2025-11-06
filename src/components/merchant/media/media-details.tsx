'use client'

import Image from 'next/image'
import { Media } from '@/types/media'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trash2, ExternalLink, FileText, Calendar, HardDrive } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { format } from 'date-fns'

interface MediaDetailsProps {
  media: Media | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (mediaId: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function MediaDetails({
  media,
  open,
  onOpenChange,
  onDelete,
}: MediaDetailsProps) {
  if (!media) return null

  const isImage = media.mimeType.startsWith('image/')
  const hasUsage = media.usage && media.usage.length > 0

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this media file?')) {
      onDelete(media.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          {isImage && (
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={media.url}
                alt={media.originalName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                unoptimized={media.url.startsWith('http://localhost') || media.url.startsWith('data:')}
              />
            </div>
          )}

          {/* File Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Filename</span>
              </div>
              <p className="text-sm font-medium break-all">{media.originalName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Size</span>
              </div>
              <p className="text-sm">{formatFileSize(media.size)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Uploaded</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">{format(new Date(media.createdAt), 'PPpp')}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Type</span>
              </div>
              <Badge variant="outline">{media.mimeType}</Badge>
            </div>
          </div>

          <Separator />

          {/* Usage Tracking */}
          {hasUsage && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Used In</h3>
                <div className="space-y-2">
                  {media.usage?.map((usage, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{usage.title}</p>
                        <Badge variant="secondary" className="mt-1">
                          {usage.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(media.url, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>

            {onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

