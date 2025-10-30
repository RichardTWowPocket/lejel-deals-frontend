'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DealForm from '@/components/deal/deal-form'

export default function EditDealPage() {
  const params = useParams<{ dealId: string }>()
  const dealId = params?.dealId

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Edit Deal</h1>
        <Link href='/merchant/deals'>
          <Button variant='outline'>Back to Deals</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DealForm mode='edit' dealId={String(dealId)} />
        </CardContent>
      </Card>
    </div>
  )
}




