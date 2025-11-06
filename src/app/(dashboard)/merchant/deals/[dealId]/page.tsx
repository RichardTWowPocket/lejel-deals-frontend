'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DealForm, DealStatusBadge, DealInventoryAlert } from '@/components/merchant/deals'
import { useMerchantDeal } from '@/hooks/merchant'
import { ErrorDisplay, DealDetailSkeleton, PageHeaderSkeleton } from '@/components/merchant/shared'
import { Package, Edit, Eye } from 'lucide-react'
import { Label } from '@/components/ui/label'

/**
 * Format currency helper
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Deal Detail/Edit Page
 * 
 * Displays deal details with view/edit mode toggle via query param.
 * 
 * URL: /merchant/deals/[dealId]?mode=edit
 * - Without ?mode=edit: Read-only view
 * - With ?mode=edit: Edit form
 */
export default function DealDetailPage() {
  const params = useParams<{ dealId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const dealId = params?.dealId
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'view'

  const { data: deal, isLoading, error, refetch } = useMerchantDeal(dealId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Deal Details</h1>
          <Link href="/merchant/deals">
            <Button variant="outline">Back to Deals</Button>
          </Link>
        </div>
        <ErrorDisplay 
          error={error} 
          onRetry={() => {
            refetch().catch(console.error)
          }} 
          title="Failed to load deal" 
        />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Deal Details</h1>
          <Link href="/merchant/deals">
            <Button variant="outline">Back to Deals</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Deal not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Edit Mode
  if (mode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Deal</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update deal information
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/merchant/deals/${dealId}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Link href="/merchant/deals">
              <Button variant="outline">Back to Deals</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <DealForm mode="edit" dealId={dealId} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // View Mode (Read-only)
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{deal.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deal details and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/merchant/deals/${dealId}?mode=edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Link href="/merchant/deals">
            <Button variant="outline">Back to Deals</Button>
          </Link>
        </div>
      </div>

      <DealInventoryAlert deal={deal} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deal Information</CardTitle>
              <DealStatusBadge status={deal.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Title</Label>
              <p className="font-medium">{deal.title}</p>
            </div>

            {deal.description && (
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Description</Label>
                <p className="text-sm">{deal.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Deal Price</Label>
                <p className="font-medium text-lg">{formatCurrency(deal.dealPrice)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Voucher Value</Label>
                <p className="font-medium text-lg line-through text-muted-foreground">
                  {formatCurrency(deal.discountPrice)}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Discount</Label>
              <Badge variant="success" className="text-sm">
                {deal.discountPercentage.toFixed(0)}% off
              </Badge>
              <span className="ml-2 text-sm text-muted-foreground">
                Save {formatCurrency(deal.discountPrice - deal.dealPrice)}
              </span>
            </div>

            {deal.quantity && deal.quantity > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Inventory</Label>
                <p className="font-medium">
                  {deal.quantityAvailable ?? deal.quantity} / {deal.quantity}
                </p>
              </div>
            )}

            {deal.category && (
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Category</Label>
                <p className="font-medium">{deal.category.name}</p>
              </div>
            )}

            {deal.featured && (
              <Badge variant="default">Featured Deal</Badge>
            )}
          </CardContent>
        </Card>

        {/* Dates & Validity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Validity & Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Valid From</Label>
              <p className="font-medium">
                {new Date(deal.validFrom).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Valid Until</Label>
              <p className="font-medium">
                {new Date(deal.validUntil).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(deal.validUntil), { addSuffix: true })}
              </p>
            </div>

            {deal.terms && (
              <div>
                <Label className="text-sm text-muted-foreground block mb-1">Terms & Conditions</Label>
                <p className="text-sm whitespace-pre-wrap">{deal.terms}</p>
              </div>
            )}

            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Created</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(deal.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground block mb-1">Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(deal.updatedAt), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images */}
      {deal.images && deal.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deal Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {deal.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border"
                >
                  <Image
                    src={imageUrl}
                    alt={`${deal.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
