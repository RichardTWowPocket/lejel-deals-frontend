'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMerchantDeals } from '@/hooks/use-merchant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function MerchantDealsPage() {
  const [merchantId] = useState<string>('demo-merchant-1')
  const [page, setPage] = useState<number>(1)
  const limit = 10

  const { data, isLoading } = useMerchantDeals(merchantId, page, limit)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Deals</h1>
          <p className='text-sm text-muted-foreground'>Manage your merchant deals</p>
        </div>
        <Link href='/merchant/deals/new'>
          <Button>Create Deal</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <div className='space-y-3'>
              {(data?.data || data?.items || []).map((deal: any) => (
                <div key={deal.id} className='flex items-center justify-between p-4 rounded-md border'>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium truncate'>{deal.title}</p>
                      <Badge variant='secondary'>{deal.status}</Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Pay {formatCurrency(Number(deal.dealPrice || deal.price || 0))} • Value {formatCurrency(Number(deal.discountPrice || deal.value || 0))}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Link href={`/merchant/deals/${deal.id}`}>
                      <Button variant='outline' size='sm'>Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='flex items-center justify-end gap-2 mt-4'>
            <Button variant='outline' size='sm' onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <span className='text-sm text-muted-foreground'>Page {page}</span>
            <Button variant='outline' size='sm' onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




