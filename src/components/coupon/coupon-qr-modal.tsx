'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Coupon } from '@/types/coupon'
import { formatCurrency } from '@/utils/format'
import { Clock, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { getTimeRemaining } from '@/utils/date'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { signQRCodeJWT } from '@/utils/qr-code'

interface CouponQRModalProps {
  coupon: Coupon
  isOpen: boolean
  onClose: () => void
}

export function CouponQRModal({ coupon, isOpen, onClose }: CouponQRModalProps) {
  const { data: session } = useSession()
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(coupon.expiresAt))
  const [signedQRCode, setSignedQRCode] = useState<string | null>(null)
  const [isSigningQR, setIsSigningQR] = useState(false)
  const [qrCountdown, setQrCountdown] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(coupon.expiresAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [coupon.expiresAt])

  // Sign JWT for QR code (async with useEffect) - regenerates every 60 seconds
  useEffect(() => {
    if (!session?.user?.id || !isOpen) {
      setSignedQRCode(null)
      setQrCountdown(60)
      return
    }

    const signJWT = async () => {
      setIsSigningQR(true)
      try {
        const token = await signQRCodeJWT({
          customerId: session.user.id,
          couponId: coupon.id,
          orderId: coupon.orderId,
          qrCode: coupon.qrCode,
        })
        setSignedQRCode(token)
        setQrCountdown(60) // Reset countdown after new QR generated
      } catch (error) {
        console.error('Failed to sign QR code JWT:', error)
        setSignedQRCode(null)
      } finally {
        setIsSigningQR(false)
      }
    }

    // Initial sign
    signJWT()

    // Regenerate every 60 seconds
    const regenerateInterval = setInterval(() => {
      signJWT()
    }, 60000)

    return () => clearInterval(regenerateInterval)
  }, [session?.user?.id, coupon.id, coupon.orderId, coupon.qrCode, isOpen])

  // QR countdown timer (counts down from 60 to 0)
  useEffect(() => {
    if (!isOpen || !signedQRCode) return

    const countdownTimer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) return 60 // Reset to 60 when regenerating
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [isOpen, signedQRCode])

  const isUrgent = !timeRemaining.isExpired && timeRemaining.days === 0 && timeRemaining.hours < 24

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center'>QR Code Kupon</DialogTitle>
          <DialogDescription className='text-center'>
            Tunjukkan QR code ini ke staff untuk melakukan redeem kupon
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* QR Code */}
          <div className='flex flex-col items-center space-y-3'>
            <div className='flex justify-center'>
              {signedQRCode ? (
                <div className='rounded-2xl bg-white p-6 shadow-lg'>
                  <QRCodeSVG
                    value={signedQRCode}
                    size={200}
                    level='L'
                    bgColor='#ffffff'
                    fgColor='#000000'
                    marginSize={1}
                  />
                </div>
              ) : (
                <div className='rounded-2xl bg-white p-6 shadow-lg flex items-center justify-center' style={{ width: 200, height: 200 }}>
                  <p className='text-sm text-muted-foreground text-center'>
                    {isSigningQR ? 'Membuat QR Code...' : 'Memuat QR Code...'}
                  </p>
                </div>
              )}
            </div>

            {/* QR Countdown Timer */}
            {signedQRCode && (
              <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                <Clock className='h-3 w-3' />
                <span>QR kode baru dalam {qrCountdown} detik</span>
              </div>
            )}
          </div>

          {/* Coupon Info */}
          <div className='space-y-3 text-center'>
            {/* Deal Title */}
            <div>
              <h3 className='text-lg font-semibold'>{coupon.deal?.title}</h3>
              {coupon.deal?.merchant && (
                <p className='text-sm text-muted-foreground'>{coupon.deal.merchant.businessName}</p>
              )}
            </div>

            {/* Voucher Value */}
            <div className='rounded-lg bg-primary/10 p-4'>
              <div className='text-sm text-muted-foreground'>Nilai Voucher</div>
              <div className='text-3xl font-bold text-primary'>
                {formatCurrency(coupon.deal?.discountPrice || 0)}
              </div>
            </div>

            {/* Expiry Info */}
            <div
              className={`flex items-center justify-center gap-2 rounded-lg p-3 ${
                isUrgent ? 'bg-destructive/10 text-destructive' : 'bg-muted'
              }`}
            >
              <Clock className='h-4 w-4' />
              <span className='text-sm font-medium'>
                {timeRemaining.isExpired ? (
                  'Sudah Expired'
                ) : (
                  <>
                    Berlaku{' '}
                    {timeRemaining.days > 0 && <>{timeRemaining.days} hari </>}
                    {timeRemaining.hours}j {timeRemaining.minutes}m lagi
                  </>
                )}
              </span>
            </div>

            {/* Instructions */}
            <div className='rounded-lg border border-border/50 bg-card/50 p-4 text-left'>
              <h4 className='mb-2 text-sm font-semibold'>Cara Menggunakan:</h4>
              <ol className='space-y-1 text-xs text-muted-foreground'>
                <li>1. Tunjukkan QR code ini ke kasir</li>
                <li>2. Kasir akan memindai QR code</li>
                <li>3. Voucher akan otomatis terpotong</li>
                <li>4. Nikmati hemat Anda!</li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

