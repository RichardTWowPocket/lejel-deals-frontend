'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useExportRedemptions } from '@/hooks/merchant/use-export-redemptions'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { RedemptionFilters } from '@/types/redemption'

interface RedemptionExportProps {
  className?: string
}

/**
 * Redemption Export Component
 * 
 * Exports redemptions to CSV with current filters applied.
 */
export function RedemptionExport({ className }: RedemptionExportProps) {
  const { filters } = useMerchantFilters<RedemptionFilters>()
  const exportMutation = useExportRedemptions()

  const handleExport = () => {
    exportMutation.mutate(filters)
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={exportMutation.isPending}
      className={className}
    >
      {exportMutation.isPending ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </>
      )}
    </Button>
  )
}



