'use client'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'

interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export function useChangePassword() {
  return useMutation<any, Error, ChangePasswordDto>({
    mutationFn: async (data: ChangePasswordDto) => {
      // Note: Backend endpoint may need to be created: PATCH /auth/change-password or PATCH /users/me/password
      // For now, we'll use a placeholder endpoint
      const response = await api.patch<ApiResponse<any>>(
        `/auth/change-password`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'changePassword' })
    },
  })
}



