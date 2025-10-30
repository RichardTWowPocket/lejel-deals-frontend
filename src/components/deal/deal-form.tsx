'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type DealFormProps = {
  mode: 'create' | 'edit'
  dealId?: string
}

export default function DealForm({ mode, dealId }: DealFormProps) {
  const router = useRouter()
  const [merchantId] = useState<string>('demo-merchant-1')
  const [title, setTitle] = useState('')
  const [dealPrice, setDealPrice] = useState<number | ''>('')
  const [discountPrice, setDiscountPrice] = useState<number | ''>('')
  const [validFrom, setValidFrom] = useState<string>('')
  const [validUntil, setValidUntil] = useState<string>('')
  const [maxQuantity, setMaxQuantity] = useState<number | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && dealId) {
      ;(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/${dealId}`)
          const json = await res.json()
          const d = json?.data || json
          setTitle(d.title || '')
          setDealPrice(Number(d.dealPrice || d.price || 0))
          setDiscountPrice(Number(d.discountPrice || d.value || 0))
          setValidFrom(d.validFrom ? new Date(d.validFrom).toISOString().slice(0, 16) : '')
          setValidUntil(d.validUntil ? new Date(d.validUntil).toISOString().slice(0, 16) : '')
          setMaxQuantity(typeof d.maxQuantity === 'number' ? d.maxQuantity : '')
        } catch {}
      })()
    }
  }, [mode, dealId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const body: any = {
        merchantId,
        title,
        dealPrice: Number(dealPrice || 0),
        discountPrice: Number(discountPrice || 0),
        validFrom: validFrom ? new Date(validFrom).toISOString() : null,
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        maxQuantity: maxQuantity === '' ? null : Number(maxQuantity),
      }

      const res = await fetch(
        mode === 'create'
          ? `${process.env.NEXT_PUBLIC_API_URL}/deals`
          : `${process.env.NEXT_PUBLIC_API_URL}/deals/${dealId}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        }
      )

      if (res.ok) router.push('/merchant/deals')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className='grid gap-6 max-w-2xl' onSubmit={handleSubmit}>
      <div className='grid gap-2'>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='dealPrice'>Pay Price (Rp)</Label>
          <Input id='dealPrice' type='number' value={dealPrice} onChange={(e) => setDealPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='discountPrice'>Voucher Value (Rp)</Label>
          <Input id='discountPrice' type='number' value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='validFrom'>Valid From</Label>
          <Input id='validFrom' type='datetime-local' value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='validUntil'>Valid Until</Label>
          <Input id='validUntil' type='datetime-local' value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </div>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='maxQuantity'>Max Quantity (optional)</Label>
        <Input id='maxQuantity' type='number' value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value === '' ? '' : Number(e.target.value))} />
      </div>

      <div className='flex items-center gap-2'>
        <Button type='submit' disabled={isSubmitting}>{mode === 'create' ? 'Create' : 'Save Changes'}</Button>
        <Button type='button' variant='outline' onClick={() => history.back()}>Cancel</Button>
      </div>
    </form>
  )
}




