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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="hidden md:block">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Kelola Promo Anda
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Atur, pantau, dan tingkatkan performa promo merchant Anda
              </p>
            </div>
            <div className="md:hidden">
              <h1 className="text-2xl font-semibold text-foreground">Kelola Promo</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Perbarui dan optimalkan promo Anda
              </p>
            </div>
          </div>

          {canCreateDeal && (
            <Button asChild className="hidden md:inline-flex bg-gradient-primary hover:bg-gradient-primary/90 h-10 md:h-11 px-4 md:px-6 text-sm md:text-base">
              <Link href="/merchant/deals/new">Buat Promo</Link>
            </Button>
          )}
        </div>

        {canCreateDeal && (
          <Button asChild className="md:hidden h-10 w-full bg-gradient-primary hover:bg-gradient-primary/90 text-sm">
            <Link href="/merchant/deals/new">
              Buat Promo
            </Link>
          </Button>
        )}

        {/* Filters */}
        <DealFilters />

        {/* Error State */}
        {error && (
          <ErrorDisplay
            error={error}
            onRetry={() => {
              refetch()
            }}
            title="Failed to load deals"
          />
        )}

        {/* Background Refetch Indicator */}
        {!isLoading && isFetching && data && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Menyegarkan data...</span>
          </div>
        )}

        {/* Deals List */}
        {!error && (
          <DealList
            deals={data?.deals || []}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        )}

        {/* Pagination */}
        {!error && data && totalPages > 1 && (
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
        )}
      </div>

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