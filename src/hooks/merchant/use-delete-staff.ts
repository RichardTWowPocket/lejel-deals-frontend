'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/staff/${id}`)
    },
    onSuccess: () => {
      // Invalidate all staff queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.all, exact: false })
      toast.success('Staff member deleted successfully')
    },
    onError: (error) => {
      handleApiError(error, { action: 'deleteStaff' })
    },
  })
}

