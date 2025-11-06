'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MediaUpload } from './media-upload'

interface MediaUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaUploadModal({ open, onOpenChange }: MediaUploadModalProps) {
  const handleUploadComplete = () => {
    // Close modal after successful upload
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        <MediaUpload onUploadComplete={handleUploadComplete} />
      </DialogContent>
    </Dialog>
  )
}



