'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { merchantKeys } from '@/lib/query-keys'
import { handleApiError } from '@/lib/error-handler'
import { useMerchant } from '@/lib/merchant-context'
import { useUIStore } from '@/store/ui-store'
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types/common'
import type { CreateStaffDto, Staff } from '@/types/staff'

export function useCreateStaff() {
  const queryClient = useQueryClient()
  const { activeMerchantId } = useMerchant()
  const { closeStaffModal } = useUIStore()

  return useMutation<Staff, Error, CreateStaffDto>({
    mutationFn: async (data: CreateStaffDto) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      const payload = {
        ...data,
        merchantId: activeMerchantId,
      }

      const response = await api.post<ApiResponse<Staff>>('/staff', payload)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate all staff queries
      queryClient.invalidateQueries({ queryKey: merchantKeys.staff.all, exact: false })
      closeStaffModal()
      toast.success('Staff member created successfully')
    },
    onError: (error) => {
      handleApiError(error, { action: 'createStaff' })
    },
  })
}



