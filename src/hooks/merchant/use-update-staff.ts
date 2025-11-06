'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import { useUIStore } from '@/store/ui-store'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { UpdateStaffDto, Staff } from '@/types/staff'

export function useUpdateStaff() {
  const queryClient = useQueryClient()
  const { closeStaffModal } = useUIStore()

  return useMutation<Staff, Error, { id: string; data: UpdateStaffDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<ApiResponse<Staff>>(`/staff/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate all staff queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.all, exact: false })
      // Invalidate specific staff detail
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.detail(variables.id) })
      closeStaffModal()
      toast.success('Staff member updated successfully')
    },
    onError: (error) => {
      handleApiError(error, { action: 'updateStaff' })
    },
  })
}



