'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMyCoupons } from '@/hooks/use-coupons'

export default function CouponsPage() {
  const { data, isLoading } = useMyCoupons(1, 10)

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        <header className='space-y-2'>
          <h1 className='text-2xl font-bold'>Kupon</h1>
          <p className='text-muted-foreground'>Kumpulkan, simpan, dan tukarkan kupon Anda.</p>
        </header>

        {isLoading ? (
          <Card className='border-dashed'>
            <CardContent className='p-8 text-center text-muted-foreground'>Memuat kupon...</CardContent>
          </Card>
        ) : !data || data.data.length === 0 ? (
          <>
            <Card className='border-dashed'>
              <CardContent className='p-8 text-center text-muted-foreground'>
                Belum ada kupon. Kupon akan muncul setelah Anda menyelesaikan pembelian.
              </CardContent>
            </Card>
            <Button asChild>
              <a href='/deals'>Cari Promo</a>
            </Button>
          </>
        ) : (
          <div className='space-y-4'>
            {data.data.map((coupon: any) => (
              <Card key={coupon.id}>
                <CardContent className='p-6 flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div className='text-sm text-muted-foreground'>Nomor Pesanan: {coupon.order?.orderNumber || '-'}</div>
                    <div className='font-medium'>{coupon.deal?.title || 'Kupon'}</div>
                    <div className='text-sm text-muted-foreground'>Status: {coupon.status}</div>
                    <div className='text-sm text-muted-foreground'>
                      Berlaku hingga: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleString() : '-'}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button asChild variant='secondary'>
                      <a href={`/customer/coupons/${coupon.id}`}>Detail</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}


