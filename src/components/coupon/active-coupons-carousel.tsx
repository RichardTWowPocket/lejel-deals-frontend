'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coupon } from '@/types/coupon'
import { formatCurrency } from '@/utils/format'
import { Clock, QrCode } from 'lucide-react'
import { getTimeRemaining } from '@/utils/date'
import { CouponQRModal } from './coupon-qr-modal'

interface ActiveCouponsCarouselProps {
  coupons: Coupon[]
}

export function ActiveCouponsCarousel({ coupons }: ActiveCouponsCarouselProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  return (
    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
      {coupons.map((coupon) => {
        const timeRemaining = getTimeRemaining(coupon.expiresAt)
        const isExpiringSoon = !timeRemaining.isExpired && timeRemaining.days === 0 && timeRemaining.hours < 24

        return (
          <Card
            key={coupon.id}
            className='min-w-[280px] flex-shrink-0 transition-all hover:shadow-lg md:min-w-[320px]'
          >
            <CardContent className='p-4'>
              {/* Merchant Logo Placeholder */}
              {coupon.deal?.images && coupon.deal.images.length > 0 ? (
                <div className='mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5'>
                  <span className='text-2xl font-bold text-primary'>
                    {coupon.deal?.title?.charAt(0) || 'C'}
                  </span>
                </div>
              ) : coupon.deal?.merchant?.logoUrl ? (
                <div className='mb-3 h-16 w-16 overflow-hidden rounded-lg'>
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5'>
                    <span className='text-2xl font-bold text-primary'>
                      {coupon.deal.merchant.businessName.charAt(0)}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Deal Title */}
              <h3 className='mb-2 line-clamp-2 font-semibold'>{coupon.deal?.title}</h3>

              {/* Merchant Name */}
              {coupon.deal?.merchant && (
                <p className='mb-3 text-sm text-muted-foreground'>
                  {coupon.deal.merchant.businessName}
                </p>
              )}

              {/* Voucher Value */}
              <div className='mb-3'>
                <div className='text-xs text-muted-foreground'>Nilai Voucher</div>
                <div className='text-2xl font-bold text-primary'>
                  {formatCurrency(coupon.deal?.discountPrice || 0)}
                </div>
              </div>

              {/* Expiry Info */}
              <div className='mb-4 flex items-center gap-2'>
                <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`text-xs ${isExpiringSoon ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
                  {timeRemaining.isExpired ? (
                    'Expired'
                  ) : (
                    <>
                      {timeRemaining.days > 0 && <>{timeRemaining.days} hari </>}
                      {timeRemaining.days === 0 && (
                        <>
                          {timeRemaining.hours}j {timeRemaining.minutes}m lagi
                        </>
                      )}
                      {timeRemaining.days > 0 && timeRemaining.days < 7 && <>lagi</>}
                    </>
                  )}
                </span>
              </div>

              {/* Status Badge */}
              <div className='mb-3'>
                <Badge variant={coupon.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {coupon.status}
                </Badge>
              </div>

              {/* Actions */}
              <div className='flex gap-2'>
                <Button 
                  size='sm' 
                  className='flex-1'
                  onClick={() => setSelectedCoupon(coupon)}
                >
                  <QrCode className='mr-2 h-4 w-4' />
                  Lihat QR
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* QR Modal */}
      {selectedCoupon && (
        <CouponQRModal
          coupon={selectedCoupon}
          isOpen={!!selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  )
}

