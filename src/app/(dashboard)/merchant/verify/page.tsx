'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { RedemptionResult } from '@/components/merchant/verify/redemption-result'
import { useValidateQR } from '@/hooks/merchant/use-validate-qr'
import { useProcessRedemption } from '@/hooks/merchant/use-process-redemption'
import { useAuth } from '@/hooks/use-auth'
import { QRValidationResponse } from '@/types/redemption'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, QrCode } from 'lucide-react'
import { PageHeaderSkeleton } from '@/components/merchant/shared/loading-skeleton'
import { ErrorDisplay } from '@/components/merchant/shared'
import toast from 'react-hot-toast'

// Lazy load QR scanner (heavy library: html5-qrcode)
const ScannerView = dynamic(
  () => import('@/components/merchant/verify/scanner-view').then((mod) => ({ default: mod.ScannerView })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Loading scanner...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-muted-foreground">Initializing camera...</p>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false, // QR scanner requires browser APIs
  }
)

type ViewState = 'scanner' | 'result' | 'success'

export default function VerifyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [viewState, setViewState] = useState<ViewState>('scanner')
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null)

  const validateQRMutation = useValidateQR()
  const processRedemptionMutation = useProcessRedemption()

  const handleScanSuccess = async (scannedToken: string) => {
    setQrToken(scannedToken)
    setViewState('result')

    try {
      const result = await validateQRMutation.mutateAsync({
        qrToken: scannedToken,
      })
      setValidationResult(result)
    } catch (error: any) {
      setValidationResult({
        isValid: false,
        error: error.message || 'Failed to validate QR code',
      })
    }
  }

  const handleScanError = (error: string) => {
    console.error('Scan error:', error)
    // Don't show error toast for frequent scanning errors
    if (!error.includes('No QR code found')) {
      toast.error('Scan error: ' + error)
    }
  }

  const handleConfirmRedemption = async () => {
    if (!qrToken || !user?.id) {
      toast.error('Missing required information')
      return
    }

    try {
      await processRedemptionMutation.mutateAsync({
        qrToken,
        redeemedByUserId: user.id,
        notes: 'Redeemed via QR scanner',
      })

      setViewState('success')
      toast.success('Redemption processed successfully!')

      // Reset after 3 seconds
      setTimeout(() => {
        resetToScanner()
      }, 3000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to process redemption')
    }
  }

  const handleCancel = () => {
    resetToScanner()
  }

  const handleScanAgain = () => {
    resetToScanner()
  }

  const resetToScanner = () => {
    setViewState('scanner')
    setQrToken(null)
    setValidationResult(null)
    validateQRMutation.reset()
    processRedemptionMutation.reset()
  }

  if (validateQRMutation.isError && !validationResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Verify & Redeem</h1>
            <p className="text-sm text-muted-foreground">Scan QR codes to verify and process redemptions</p>
          </div>
        </div>
        <ErrorDisplay
          error={validateQRMutation.error}
          onRetry={resetToScanner}
          title="Failed to validate QR code"
          description="An error occurred while validating the QR code. Please try again."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verify & Redeem</h1>
          <p className="text-sm text-muted-foreground">Scan QR codes to verify and process redemptions</p>
        </div>
        {viewState !== 'scanner' && (
          <Button variant="outline" onClick={resetToScanner}>
            New Scan
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {viewState === 'scanner' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Scan the customer's QR code or enter it manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScannerView
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />
            </CardContent>
          </Card>
        )}

        {viewState === 'result' && validationResult && (
          <div className="space-y-4">
            <RedemptionResult
              validation={validationResult}
              isProcessing={processRedemptionMutation.isPending}
              onConfirm={handleConfirmRedemption}
              onCancel={handleCancel}
              onScanAgain={handleScanAgain}
            />
          </div>
        )}

        {viewState === 'success' && (
          <Card className="border-success">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle>Redemption Successful!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The coupon has been successfully redeemed and marked as used.
              </p>
              <Button onClick={resetToScanner} className="w-full">
                Scan Another QR Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



