'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DealForm } from '@/components/merchant/deals'

/**
 * New Deal Page
 * 
 * Page for creating a new deal.
 * Uses the DealForm component with mode="create".
 */
export default function NewDealPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create Deal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new deal for your customers
          </p>
        </div>
        <Link href="/merchant/deals">
          <Button variant="outline">Back to Deals</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DealForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
