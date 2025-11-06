'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DealStatusBadge } from './deal-status-badge'
import { DealInventoryAlert } from './deal-inventory-alert'
import { DealActions } from './deal-actions'
import { EmptyState } from '@/components/merchant/shared/empty-state'
import { InlineEmptyState } from '@/components/merchant/shared/empty-state'
import { DealsListSkeleton, TableSkeleton } from '@/components/merchant/shared/loading-skeleton'
import type { Deal } from '@/types/deal'
import { Package } from 'lucide-react'

interface DealListProps {
  deals: Deal[]
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Deal List Component
 * 
 * Displays deals in table view (desktop) and card view (mobile).
 * Includes status badges, inventory alerts, and actions.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useMerchantDeals(filters)
 * <DealList deals={data?.deals || []} isLoading={isLoading} error={error} />
 * ```
 */
export function DealList({ deals, isLoading, error, onRetry }: DealListProps) {
  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="hidden md:block">
          <TableSkeleton columns={6} rows={5} />
        </div>
        <div className="md:hidden">
          <DealsListSkeleton count={5} />
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={Package}
        title="Failed to load deals"
        description="There was an error loading your deals. Please try again."
        action={
          onRetry
            ? {
                label: 'Try Again',
                onClick: onRetry,
              }
            : undefined
        }
      />
    )
  }

  // Empty state
  if (!deals || deals.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No deals found"
        description="Create your first deal to get started with your merchant dashboard."
        action={{
          label: 'Create Deal',
          onClick: () => {},
        }}
      />
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                      {deal.thumbnailUrl || deal.images?.[0] ? (
                        <Image
                          src={deal.thumbnailUrl || deal.images[0]}
                          alt={deal.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={deal.thumbnailUrl?.startsWith('http://localhost') || deal.thumbnailUrl?.startsWith('data:')}
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/merchant/deals/${deal.id}`}
                        className="font-medium hover:underline line-clamp-1 block"
                        title={deal.title}
                      >
                        {deal.title}
                      </Link>
                      {deal.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5" title={deal.description}>
                          {deal.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DealStatusBadge status={deal.status} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatCurrency(deal.dealPrice)}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      {formatCurrency(deal.discountPrice)}
                    </div>
                    <div className="text-xs text-success">
                      {deal.discountPercentage.toFixed(0)}% off
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {deal.maxQuantity && deal.maxQuantity > 0 ? (
                    <div className="space-y-1">
                      <div className="text-sm">
                        {deal.quantityAvailable ?? deal.maxQuantity} / {deal.maxQuantity}
                      </div>
                      {deal.quantityAvailable !== undefined &&
                        deal.quantityAvailable / deal.maxQuantity <= 0.2 && (
                          <Badge variant="warning" className="text-xs">
                            Low Stock
                          </Badge>
                        )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unlimited</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistanceToNow(new Date(deal.validUntil), {
                      addSuffix: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DealActions deal={deal} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/merchant/deals/${deal.id}`}
                    className="block"
                  >
                    <CardTitle className="text-lg mb-2 hover:underline">
                      {deal.title}
                    </CardTitle>
                  </Link>
                  <DealStatusBadge status={deal.status} className="mb-2" />
                  {deal.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {deal.description}
                    </p>
                  )}
                </div>
                <DealActions deal={deal} />
              </div>
            </CardHeader>
            <CardContent>
              <DealInventoryAlert deal={deal} />
              
              <div className="space-y-4 mt-4">
                {/* Image */}
                {deal.thumbnailUrl || deal.images?.[0] ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={deal.thumbnailUrl || deal.images[0]}
                      alt={deal.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 640px"
                      unoptimized={deal.thumbnailUrl?.startsWith('http://localhost') || deal.thumbnailUrl?.startsWith('data:')}
                    />
                  </div>
                ) : null}

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">
                    {formatCurrency(deal.dealPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(deal.discountPrice)}
                  </span>
                  <Badge variant="success" className="text-xs">
                    {deal.discountPercentage.toFixed(0)}% off
                  </Badge>
                </div>

                {/* Inventory */}
                {deal.maxQuantity && deal.maxQuantity > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Inventory: </span>
                    <span className="font-medium">
                      {deal.quantityAvailable ?? deal.maxQuantity} / {deal.maxQuantity}
                    </span>
                  </div>
                )}

                {/* Valid Until */}
                <div className="text-sm text-muted-foreground">
                  Valid until:{' '}
                  {formatDistanceToNow(new Date(deal.validUntil), {
                    addSuffix: true,
                  })}
                </div>

                {/* View Button */}
                <Link href={`/merchant/deals/${deal.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}



