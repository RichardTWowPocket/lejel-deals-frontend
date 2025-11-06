'use client'

import { useMerchant } from '@/lib/merchant-context'
import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import api from '@/lib/api'
import { Building2 } from 'lucide-react'
import type { Merchant } from '@/types/merchant'
import type { ApiResponse } from '@/types/common'
import { publicMerchantKeys } from '@/lib/query-keys'

/**
 * Merchant Selector Component
 * 
 * Displays a dropdown to switch between multiple merchants.
 * Only shows when user has multiple merchant memberships.
 * 
 * @example
 * ```tsx
 * <MerchantSelector />
 * ```
 */
export function MerchantSelector() {
  const {
    activeMerchantId,
    merchantIds,
    switchMerchant,
    hasMultipleMerchants,
    isLoading: contextLoading,
  } = useMerchant()

  // Fetch merchant details for display
  const { data: merchants, isLoading: merchantsLoading } = useQuery({
    queryKey: [...publicMerchantKeys.all, 'selector', merchantIds],
    queryFn: async () => {
      if (merchantIds.length === 0) return []
      
      // Fetch all merchants in parallel
      const promises = merchantIds.map((id) =>
        api.get<ApiResponse<Merchant>>(`/merchants/${id}`).then((res) => res.data.data)
      )
      return Promise.all(promises)
    },
    enabled: merchantIds.length > 0 && !contextLoading,
  })

  // Don't show if only one merchant or loading
  if (!hasMultipleMerchants || contextLoading || merchantsLoading) {
    return null
  }

  const handleMerchantChange = (merchantId: string) => {
    switchMerchant(merchantId)
  }

  const activeMerchant = merchants?.find((m) => m.id === activeMerchantId)

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <Select
        value={activeMerchantId || ''}
        onValueChange={handleMerchantChange}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select merchant">
            {activeMerchant?.name || 'Select merchant'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {merchants?.map((merchant) => (
            <SelectItem key={merchant.id} value={merchant.id}>
              {merchant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * Compact Merchant Selector
 * 
 * Minimal version for tight spaces (e.g., sidebar when collapsed)
 */
export function CompactMerchantSelector() {
  const {
    activeMerchantId,
    merchantIds,
    switchMerchant,
    hasMultipleMerchants,
    isLoading: contextLoading,
  } = useMerchant()

  const { data: merchants, isLoading: merchantsLoading } = useQuery({
    queryKey: [...publicMerchantKeys.all, 'selector', merchantIds],
    queryFn: async () => {
      if (merchantIds.length === 0) return []
      
      const promises = merchantIds.map((id) =>
        api.get<ApiResponse<Merchant>>(`/merchants/${id}`).then((res) => res.data.data)
      )
      return Promise.all(promises)
    },
    enabled: merchantIds.length > 0 && !contextLoading,
  })

  if (!hasMultipleMerchants || contextLoading || merchantsLoading) {
    return null
  }

  const activeMerchant = merchants?.find((m) => m.id === activeMerchantId)

  return (
    <Select
      value={activeMerchantId || ''}
      onValueChange={switchMerchant}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {activeMerchant?.name ? (
            <span className="truncate">{activeMerchant.name}</span>
          ) : (
            'Select'
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {merchants?.map((merchant) => (
          <SelectItem key={merchant.id} value={merchant.id}>
            {merchant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

