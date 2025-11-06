'use client'

import { OrderListResponse, Order } from '@/types/order'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderRow } from './order-row'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { OrderFilters } from '@/types/order'
import { EmptyState } from '@/components/merchant/shared/empty-state'
import { ShoppingBag } from 'lucide-react'

interface OrderListProps {
  data?: OrderListResponse
  onViewDetails?: (order: Order) => void
}

export function OrderList({ data, onViewDetails }: OrderListProps) {
  const { filters, updateFilters } = useMerchantFilters<OrderFilters>()

  const orders = data?.orders || []
  const pagination = data?.pagination

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders found"
        description="No orders match your current filters. Try adjusting your search criteria."
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
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="w-[150px]">Order Number</TableHead>
                <TableHead className="w-[200px]">Customer</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead className="w-[120px]">Amount</TableHead>
                <TableHead className="w-[100px]">Coupons</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
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
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-0">
              <OrderRow
                order={order}
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


