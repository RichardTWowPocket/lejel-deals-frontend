'use client'

import { AlertCircle, Clock } from 'lucide-react'
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
    <div
      className={`rounded-lg border-2 p-3 sm:p-4 md:p-6 ${
        isUrgent
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-warning/50 bg-warning/5'
      }`}
    >
      <div className='flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between'>
        {/* Left side - Coupon Info */}
        <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
          <div className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-background flex-shrink-0'>
            <AlertCircle className={`h-5 w-5 sm:h-6 sm:w-6 ${isUrgent ? 'text-destructive' : 'text-warning'}`} />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
              <h3 className='text-sm sm:text-base font-semibold line-clamp-2'>{coupon.deal?.title}</h3>
              {coupon.deal?.merchant && (
                <span className='text-xs sm:text-sm text-muted-foreground truncate'>
                  {coupon.deal.merchant.businessName}
                </span>
              )}
            </div>
            <div className='mb-2 text-xs sm:text-sm text-muted-foreground'>
              Nilai Voucher: <span className='font-semibold text-foreground'>{formatCurrency(coupon.deal?.discountPrice || 0)}</span>
            </div>
            {/* Countdown */}
            <div className='flex items-center gap-2'>
              <Clock className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${isUrgent ? 'text-destructive' : 'text-warning'}`} />
              <span className={`text-xs sm:text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-warning'}`}>
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
        <div className='flex gap-2 sm:gap-3 flex-shrink-0'>
          <Button 
            size='sm' 
            variant='outline'
            onClick={() => setShowQRModal(true)}
            className='h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial'
          >
            Lihat QR
          </Button>
          <Button asChild size='sm' className='h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial'>
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
    </div>
  )
}

