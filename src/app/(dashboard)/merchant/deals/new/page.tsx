'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import  DealForm from '@/components/deal/deal-form'

export default function NewDealPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Create Deal</h1>
        <Link href='/merchant/deals'>
          <Button variant='outline'>Back to Deals</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DealForm mode='create' />
        </CardContent>
      </Card>
    </div>
  )
}




