import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DealCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-[4/3] w-full' />
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center gap-2'>
          <Skeleton className='h-5 w-5 rounded' />
          <Skeleton className='h-4 w-32' />
        </div>
        <Skeleton className='mb-2 h-6 w-full' />
        <Skeleton className='mb-3 h-4 w-3/4' />
        <div className='mb-3 flex gap-2'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-5 w-32' />
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Skeleton className='h-10 w-full' />
      </CardFooter>
    </Card>
  )
}

