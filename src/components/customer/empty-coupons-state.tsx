'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ticket, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function EmptyCouponsState() {
  return (
    <Card className='border-2 border-dashed border-border/50 bg-muted/20'>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
          <Ticket className='h-10 w-10 text-primary' />
        </div>
        <h3 className='mb-2 text-xl font-semibold'>Belum Ada Kupon Aktif</h3>
        <p className='mb-6 max-w-md text-muted-foreground'>
          Anda belum memiliki kupon aktif. Mulai hemat sekarang dengan membeli deal terbaik hari ini!
        </p>
        <div className='flex gap-3'>
          <Button asChild size='lg'>
            <Link href='/deals'>
              <Sparkles className='mr-2 h-5 w-5' />
              Jelajahi Deal
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/categories'>Lihat Kategori</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


