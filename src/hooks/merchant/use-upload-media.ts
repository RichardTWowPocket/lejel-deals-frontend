'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { Media } from '@/types/media'

interface UploadMediaResponse {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy?: string | null
  createdAt: string
}

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation<Media, Error, File>({
    mutationFn: async (file: File) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error(`File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      }

      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<ApiResponse<UploadMediaResponse>>(
        '/media/upload/direct',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return response.data.data
    },
    onSuccess: () => {
      // Invalidate all media queries (including all filter variations)
      queryClient.invalidateQueries({ queryKey: merchantKeys.media.all, exact: false })
      toast.success('Media uploaded successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'uploadMedia' })
    },
  })
}

export function useUploadMultipleMedia() {
  const queryClient = useQueryClient()
  const uploadMedia = useUploadMedia()

  return useMutation<Media[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      // Upload files sequentially to avoid overwhelming the server
      const results: Media[] = []
      
      for (const file of files) {
        try {
          const result = await uploadMedia.mutateAsync(file)
          results.push(result)
        } catch (error) {
          // Continue with other files even if one fails
          console.error(`Failed to upload ${file.name}:`, error)
          throw error // Re-throw to stop on first error (or collect all errors)
        }
      }

      return results
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.media.all, exact: false })
      toast.success(`${results.length} file(s) uploaded successfully!`)
    },
    onError: (error) => {
      handleApiError(error, { action: 'uploadMultipleMedia' })
    },
  })
}



