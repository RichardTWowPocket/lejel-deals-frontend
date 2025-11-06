'use client'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { RedemptionFilters, RedemptionResponse } from '@/types/redemption'
import { useMerchant } from '@/lib/merchant-context'
import { handleApiError } from '@/lib/error-handler'
import toast from 'react-hot-toast'

/**
 * Export redemptions to CSV
 * 
 * This hook fetches redemptions with filters and converts them to CSV format
 */
export function useExportRedemptions() {
  const { activeMerchantId } = useMerchant()

  return useMutation<string, Error, RedemptionFilters>({
    mutationFn: async (filters?: RedemptionFilters) => {
      if (!activeMerchantId) {
        throw new Error('No active merchant selected.')
      }

      // Build query params
      const params = new URLSearchParams()
      params.append('merchantId', activeMerchantId)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'startDate' || key === 'endDate') {
              params.append(key, new Date(value).toISOString())
            } else if (key !== 'page' && key !== 'limit') {
              // Don't include pagination for export
              params.append(key, String(value))
            }
          }
        })
      }

      // Fetch all redemptions (no pagination limit for export)
      params.append('limit', '1000') // Large limit to get all
      
      const response = await api.get<{ data: { redemptions: RedemptionResponse[] } }>(
        `/redemptions?${params.toString()}`
      )
      
      const redemptions = response.data.data.redemptions

      // Convert to CSV
      const headers = [
        'Date',
        'Time',
        'Customer Name',
        'Customer Email',
        'Deal Title',
        'Order Number',
        'Voucher Value',
        'Status',
        'Redeemed By',
        'Notes',
        'Location',
      ]

      const rows = redemptions.map((redemption) => {
        const date = new Date(redemption.redeemedAt)
        return [
          date.toLocaleDateString('id-ID'),
          date.toLocaleTimeString('id-ID'),
          `${redemption.customer?.firstName || ''} ${redemption.customer?.lastName || ''}`.trim(),
          redemption.customer?.email || '',
          redemption.deal?.title || '',
          redemption.order?.orderNumber || '',
          redemption.deal?.discountPrice?.toString() || '0',
          redemption.status,
          redemption.redeemedByUserId || 'N/A',
          redemption.notes || '',
          redemption.location || '',
        ]
      })

      // Escape CSV values (handle commas and quotes)
      const escapeCSV = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }

      const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map((row) => row.map((cell) => escapeCSV(String(cell || ''))).join(',')),
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `redemptions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return csvContent
    },
    onSuccess: () => {
      toast.success('Redemptions exported successfully!')
    },
    onError: (error) => {
      handleApiError(error, { action: 'exportRedemptions' })
      toast.error('Failed to export redemptions')
    },
  })
}



