'use client'

import { AlertCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coupon } from '@/types/coupon'
import { formatCurrency } from '@/utils/format'
import { getTimeRemaining } from '@/utils/date'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CouponQRModal } from './coupon-qr-modal'

interface CouponHeroStripProps {
  coupon: Coupon
}

export function CouponHeroStrip({ coupon }: CouponHeroStripProps) {
  const [showQRModal, setShowQRModal] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(coupon.expiresAt))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(coupon.expiresAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [coupon.expiresAt])

  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours < 24

  return (
    <Card
      className={`border-2 p-6 ${
        isUrgent
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-warning/50 bg-warning/5'
      }`}
    >
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        {/* Left side - Coupon Info */}
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-background'>
            <AlertCircle className={`h-6 w-6 ${isUrgent ? 'text-destructive' : 'text-warning'}`} />
          </div>
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <h3 className='font-semibold'>{coupon.deal?.title}</h3>
              {coupon.deal?.merchant && (
                <span className='text-sm text-muted-foreground'>• {coupon.deal.merchant.businessName}</span>
              )}
            </div>
            <div className='mb-2 text-sm text-muted-foreground'>
              Nilai Voucher: <span className='font-semibold text-foreground'>{formatCurrency(coupon.deal?.discountPrice || 0)}</span>
            </div>
            {/* Countdown */}
            <div className='flex items-center gap-2'>
              <Clock className={`h-4 w-4 ${isUrgent ? 'text-destructive' : 'text-warning'}`} />
              <span className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-warning'}`}>
                {timeRemaining.isExpired ? (
                  'Expired'
                ) : (
                  <>
                    Expires in{' '}
                    {timeRemaining.days > 0 && <>{timeRemaining.days}d </>}
                    {String(timeRemaining.hours).padStart(2, '0')}:
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className='flex gap-2'>
          <Button 
            size='sm' 
            variant='outline'
            onClick={() => setShowQRModal(true)}
          >
            Lihat QR
          </Button>
          <Button asChild size='sm'>
            <Link href={`/deals/${coupon.deal?.id}`}>Beli Lagi</Link>
          </Button>
        </div>
      </div>

      {/* QR Modal */}
      <CouponQRModal
        coupon={coupon}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </Card>
  )
}

