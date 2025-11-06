'use client'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { QRValidationResponse } from '@/types/redemption'
import { ApiResponse } from '@/types/common'
import { handleApiError } from '@/lib/error-handler'
import { useAuth } from '@/hooks/use-auth'

interface ValidateQRDto {
  qrToken: string
  staffId?: string
}

export function useValidateQR() {
  const { user } = useAuth()

  return useMutation<QRValidationResponse, Error, ValidateQRDto>({
    mutationFn: async ({ qrToken, staffId }: ValidateQRDto) => {
      const response = await api.post<ApiResponse<QRValidationResponse>>(
        '/qr-security/validate',
        {
          qrToken,
          staffId: staffId || user?.id, // Use current user ID if staffId not provided
        }
      )
      return response.data.data
    },
    onError: (error) => handleApiError(error, { action: 'validateQR' }),
  })
}



