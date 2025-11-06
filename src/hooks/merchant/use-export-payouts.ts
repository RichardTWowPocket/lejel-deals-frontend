'use client'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import { useMerchant } from '@/lib/merchant-context'
import toast from 'react-hot-toast'
import type { PayoutPeriod, PayoutResponse } from '@/types/payout'
import type { ApiResponse } from '@/types/common'
import { format } from 'date-fns'

export function useExportPayouts() {
  const { activeMerchantId } = useMerchant()

  return useMutation<string, Error, PayoutPeriod>({
    mutationFn: async (period: PayoutPeriod) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      // Note: Backend may not have export endpoint yet
      // For now, we'll generate CSV client-side from the payout data
      // TODO: Update when backend export endpoint is available
      const params = new URLSearchParams()
      params.append('period', period)
      if (activeMerchantId) {
        params.append('merchantId', activeMerchantId)
      }

      const response = await api.get<ApiResponse<PayoutResponse>>(
        `/merchants/me/payouts?${params.toString()}`
      )
      const payoutData = response.data.data

      // Generate CSV content
      const headers = ['Date', 'Order Number', 'Customer Name', 'Customer Email', 'Deal', 'Amount', 'Status']
      const rows = payoutData.orders.map((order) => {
        const customerName = order.customer
          ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Unknown'
          : 'Unknown'
        const customerEmail = order.customer?.email || ''
        
        return [
          format(new Date(order.createdAt), 'yyyy-MM-dd'),
          order.orderNumber,
          customerName,
          customerEmail,
          order.deal?.title || 'N/A',
          order.totalAmount.toString(),
          order.status,
        ]
      })

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')

      return csvContent
    },
    onSuccess: (csvContent, period) => {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `payouts_export_${period}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Payouts exported successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'exportPayouts' })
    },
  })
}
