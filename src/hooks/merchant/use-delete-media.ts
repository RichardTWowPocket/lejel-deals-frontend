'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'

interface DeleteMediaResponse {
  message: string
  id: string
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation<DeleteMediaResponse, Error, string>({
    mutationFn: async (mediaId: string) => {
      const response = await api.delete<ApiResponse<DeleteMediaResponse>>(`/media/${mediaId}`)
      return response.data.data
    },
    onSuccess: (_, mediaId) => {
      // Invalidate all media queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.media.all, exact: false })
      queryClient.invalidateQueries({ queryKey: merchantKeys.media.detail(mediaId) })
      toast.success('Media deleted successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'deleteMedia' })
    },
  })
}

export function useBulkDeleteMedia() {
  const queryClient = useQueryClient()
  const deleteMedia = useDeleteMedia()

  return useMutation<void, Error, string[]>({
    mutationFn: async (mediaIds: string[]) => {
      // Delete files sequentially
      await Promise.all(
        mediaIds.map((id) => deleteMedia.mutateAsync(id))
      )
    },
    onSuccess: (_, mediaIds) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.media.all, exact: false })
      toast.success(`${mediaIds.length} file(s) deleted successfully!`)
    },
    onError: (error) => {
      handleApiError(error, { action: 'bulkDeleteMedia' })
    },
  })
}



