'use client'

import { RedemptionListResponse, RedemptionResponse } from '@/types/redemption'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RedemptionRow } from './redemption-row'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { RedemptionFilters } from '@/types/redemption'
import { EmptyState } from '@/components/merchant/shared/empty-state'
import { Receipt } from 'lucide-react'

interface RedemptionListProps {
  data?: RedemptionListResponse
  onViewDetails?: (redemption: RedemptionResponse) => void
}

export function RedemptionList({ data, onViewDetails }: RedemptionListProps) {
  const { filters, updateFilters } = useMerchantFilters<RedemptionFilters>()

  const redemptions = data?.redemptions || []
  const pagination = data?.pagination

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  if (redemptions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No redemptions found"
        description="No redemptions match your current filters. Try adjusting your search criteria."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Date & Time</TableHead>
                <TableHead className="w-[200px]">Customer</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead className="w-[150px]">Order</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((redemption) => (
                <RedemptionRow
                  key={redemption.id}
                  redemption={redemption}
                  onViewDetails={onViewDetails}
                  variant="table"
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {redemptions.map((redemption) => (
          <Card key={redemption.id}>
            <CardContent className="p-0">
              <RedemptionRow
                redemption={redemption}
                onViewDetails={onViewDetails}
                variant="card"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            />
            <PaginationItem className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
