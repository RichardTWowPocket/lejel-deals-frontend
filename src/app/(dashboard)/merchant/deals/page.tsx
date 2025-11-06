'use client'

import Link from 'next/link'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import { useMerchantDeals } from '@/hooks/merchant'
import { DealFilters, DealList } from '@/components/merchant/deals'
import { Button } from '@/components/ui/button'
import { ErrorDisplay } from '@/components/merchant/shared/error-display'
import { useCanPerformAction } from '@/hooks/use-can-perform-action'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { DealFilters as DealFiltersType } from '@/types/deal'
import { Plus } from 'lucide-react'

/**
 * Merchant Deals Page
 * 
 * Main page for managing merchant deals.
 * Features:
 * - List view with filters (status, category, search)
 * - URL-synced filters
 * - Pagination
 * - Responsive table/card views
 */
export default function MerchantDealsPage() {
  const { filters, updateFilters } = useMerchantFilters<DealFiltersType>({
    defaults: {
      page: 1,
      limit: 10,
      status: undefined,
      categoryId: undefined,
      search: undefined,
    },
  })

  const { data, isLoading, isFetching, error, refetch } = useMerchantDeals(filters)
  const { canCreateDeal } = useCanPerformAction()

  const totalPages = data?.pagination?.totalPages || 1
  const currentPage = filters.page || 1

  return (
    <div className="space-y-0 md:space-y-6 relative">
      {/* Create Deal Button - Desktop */}
      {canCreateDeal && (
        <div className="hidden md:flex justify-end">
          <Link href="/merchant/deals/new">
            <Button>Create Deal</Button>
          </Link>
        </div>
      )}

      {/* Filters */}
      <DealFilters />

      {/* Error State */}
      {error && (
        <div className="!mt-4 md:!mt-0">
          <ErrorDisplay
            error={error}
            onRetry={() => {
              refetch()
            }}
            title="Failed to load deals"
          />
        </div>
      )}

      {/* Background Refetch Indicator */}
      {!isLoading && isFetching && data && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground !mt-4 md:!mt-0">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing...</span>
        </div>
      )}

      {/* Deals List */}
      {!error && (
        <div className="!mt-4 md:!mt-0">
          <DealList
            deals={data?.deals || []}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </div>
      )}

      {/* Pagination */}
      {!error && data && totalPages > 1 && (
        <div className="!mt-4 md:!mt-0">
          <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) {
                    updateFilters({ page: currentPage - 1 })
                  }
                }}
                className={
                  currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      updateFilters({ page: pageNum })
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) {
                    updateFilters({ page: currentPage + 1 })
                  }
                }}
                className={
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
      )}

      {/* Floating Action Button - Mobile */}
      {canCreateDeal && (
        <Link
          href="/merchant/deals/new"
          className="fixed bottom-20 right-4 z-50 md:hidden"
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  )
}