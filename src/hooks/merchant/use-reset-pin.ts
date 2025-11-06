'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { Staff, ResetPinResponse } from '@/types/staff'

export function useResetPin() {
  const queryClient = useQueryClient()

  return useMutation<ResetPinResponse, Error, string>({
    mutationFn: async (id: string) => {
      // Generate a new PIN (4 digits)
      const newPin = Math.floor(1000 + Math.random() * 9000).toString()

      // Use PATCH /staff/:id endpoint to update PIN
      // The backend update method accepts pin in UpdateStaffDto and hashes it
      // This bypasses the currentPin validation required by changePin endpoint
      const response = await api.patch<ApiResponse<Staff>>(`/staff/${id}`, {
        pin: newPin,
      })

      // Return the new PIN for display (backend doesn't return it, so we return what we generated)
      return {
        staffId: id,
        newPin,
        message: 'PIN reset successfully',
      }
    },
    onSuccess: (data) => {
      // Invalidate all staff queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.all, exact: false })
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.detail(data.staffId) })
      return data
    },
    onError: (error) => {
      handleApiError(error, { action: 'resetPin' })
    },
  })
}

