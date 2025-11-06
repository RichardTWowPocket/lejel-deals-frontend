'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useExportPayouts } from '@/hooks/merchant/use-export-payouts'
import type { PayoutPeriod } from '@/types/payout'

interface PayoutExportProps {
  period: PayoutPeriod
  className?: string
}

export function PayoutExport({ period, className }: PayoutExportProps) {
  const exportMutation = useExportPayouts()

  const handleExport = () => {
    exportMutation.mutate(period)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exportMutation.isPending}
      className={className}
    >
      {exportMutation.isPending ? (
        'Exporting...'
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </>
      )}
    </Button>
  )
}



