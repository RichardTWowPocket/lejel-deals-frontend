'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { useUploadMultipleMedia } from '@/hooks/merchant'
import { cn } from '@/lib/utils'
import type { UploadProgress } from '@/types/media'

interface MediaUploadProps {
  onUploadComplete?: () => void
  className?: string
}

export function MediaUpload({ onUploadComplete, className }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const uploadMutation = useUploadMultipleMedia()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateFiles = (fileList: FileList): File[] => {
    const validFiles: File[] = []
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const maxSize = 5 * 1024 * 1024 // 5MB

    Array.from(fileList).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        console.warn(`File ${file.name} has invalid type: ${file.type}`)
        return
      }
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds 5MB limit`)
        return
      }
      validFiles.push(file)
    })

    return validFiles
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const validFiles = validateFiles(e.dataTransfer.files)
        setFiles((prev) => [...prev, ...validFiles])
      }
    },
    []
  )

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files)
      setFiles((prev) => [...prev, ...validFiles])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }, [])

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return

    try {
      await uploadMutation.mutateAsync(files)
      setFiles([])
      onUploadComplete?.()
    } catch (error) {
      // Error handled by mutation hook
    }
  }, [files, uploadMutation, onUploadComplete])

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports: JPEG, PNG, WebP, GIF, SVG (Max 5MB per file)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('media-file-input')?.click()}
            >
              Select Files
            </Button>
            <input
              id="media-file-input"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {files.length} file(s) selected
              </p>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                size="sm"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {files.length} file(s)
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2 bg-background">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



