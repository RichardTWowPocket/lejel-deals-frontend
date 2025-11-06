'use client'

import { QRValidationResponse } from '@/types/redemption'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertTriangle, Loader2, User, ShoppingBag, Ticket, Store } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RedemptionResultProps {
  validation: QRValidationResponse | null
  isProcessing?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  onScanAgain?: () => void
  className?: string
}

export function RedemptionResult({
  validation,
  isProcessing = false,
  onConfirm,
  onCancel,
  onScanAgain,
  className,
}: RedemptionResultProps) {
  if (!validation) {
    return null
  }

  if (!validation.isValid) {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Invalid QR Code</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{validation.error || 'The QR code is invalid or cannot be processed.'}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Common reasons:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>QR code has already been used</li>
              <li>QR code has expired</li>
              <li>QR code is invalid or tampered with</li>
              <li>Coupon does not belong to this merchant</li>
            </ul>
          </div>

          <div className="flex gap-2">
            {onScanAgain && (
              <Button variant="default" onClick={onScanAgain} className="flex-1">
                Scan Again
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { coupon, order, deal, customer } = validation

  if (!coupon || !order || !deal || !customer) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Validation Error</AlertTitle>
        <AlertDescription>Incomplete validation data received.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={cn('border-success', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <CardTitle>Valid QR Code</CardTitle>
          </div>
          <Badge variant="success">Ready to Redeem</Badge>
        </div>
        <CardDescription>Review the coupon details before confirming redemption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deal Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Ticket className="h-4 w-4" />
            Deal Information
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-semibold text-lg">{deal.title}</p>
            {deal.description && (
              <p className="text-sm text-muted-foreground">{deal.description}</p>
            )}
            <p className="text-sm font-medium">
              Voucher Value: <span className="text-success">{formatCurrency(deal.discountPrice)}</span>
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Customer Information
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Order Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            Order Information
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium">Order #{order.orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              Total: {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Coupon Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Ticket className="h-4 w-4" />
            Coupon Details
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-sm">
              Status: <Badge variant="outline">{coupon.status}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              Expires: {format(new Date(coupon.expiresAt), 'PPp')}
            </p>
            {coupon.usedAt && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This coupon was already used on {format(new Date(coupon.usedAt), 'PPp')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {onConfirm && (
            <Button
              onClick={onConfirm}
              disabled={isProcessing || !!coupon.usedAt}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Redemption
                </>
              )}
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

