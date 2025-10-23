'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useCustomerOrders } from '@/hooks/use-orders'
import { UserRole } from '@/lib/constants'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data, isLoading } = useCustomerOrders(user?.id || '')

  console.log('[OrdersPage] Data', data)

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        <header className='space-y-2'>
          <h1 className='text-2xl font-bold'>Pesanan</h1>
          <p className='text-muted-foreground'>Lihat status dan riwayat pesanan Anda.</p>
        </header>

        {isLoading ? (
          <Card>
            <CardContent className='p-8 text-center text-muted-foreground'>Memuat pesanan...</CardContent>
          </Card>
        ) : !data || data.data.length === 0 ? (
          <>
            <Card className='border-dashed'>
              <CardContent className='p-8 text-center text-muted-foreground'>
                Belum ada pesanan. Mulai jelajahi promo dan lakukan pembelian.
              </CardContent>
            </Card>
            <Button asChild>
              <a href='/deals'>Lihat Promo</a>
            </Button>
          </>
        ) : (
          <div className='space-y-4'>
            {data.data.map((order: any) => (
              <Card key={order.id}>
                <CardContent className='p-6 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold'>{order.orderNumber}</div>
                    <div className='text-sm text-muted-foreground'>Status: {order.status}</div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold'>Rp {Number(order.totalAmount).toLocaleString('id-ID')}</div>
                    <Button asChild variant='outline' className='mt-2'>
                      <a href={`/customer/orders/${order.id}`}>Lihat Detail</a>
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


