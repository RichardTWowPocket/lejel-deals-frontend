'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { getTimeRemaining } from '@/utils/date'

interface DealCountdownProps {
  endDate: string
  className?: string
  compact?: boolean
}

export function DealCountdown({ endDate, className = '', compact = false }: DealCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(endDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (timeRemaining.isExpired) {
    return (
      <div className={`flex items-center gap-2 text-sm text-destructive ${className}`}>
        <Clock className='h-4 w-4' />
        <span className='font-medium'>Expired</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-sm ${className}`}>
        <Clock className='h-4 w-4 text-primary' />
        <span className='font-medium'>
          {timeRemaining.days > 0 && `${timeRemaining.days}d `}
          {timeRemaining.hours}h {timeRemaining.minutes}m
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Clock className='h-5 w-5 text-primary' />
      <div className='flex gap-2'>
        {timeRemaining.days > 0 && (
          <div className='flex flex-col items-center rounded-lg bg-primary/10 px-3 py-2'>
            <span className='text-xl font-bold text-primary'>{timeRemaining.days}</span>
            <span className='text-xs text-muted-foreground'>days</span>
          </div>
        )}
        <div className='flex flex-col items-center rounded-lg bg-primary/10 px-3 py-2'>
          <span className='text-xl font-bold text-primary'>
            {String(timeRemaining.hours).padStart(2, '0')}
          </span>
          <span className='text-xs text-muted-foreground'>hours</span>
        </div>
        <div className='flex flex-col items-center rounded-lg bg-primary/10 px-3 py-2'>
          <span className='text-xl font-bold text-primary'>
            {String(timeRemaining.minutes).padStart(2, '0')}
          </span>
          <span className='text-xs text-muted-foreground'>mins</span>
        </div>
        <div className='flex flex-col items-center rounded-lg bg-primary/10 px-3 py-2'>
          <span className='text-xl font-bold text-primary'>
            {String(timeRemaining.seconds).padStart(2, '0')}
          </span>
          <span className='text-xs text-muted-foreground'>secs</span>
        </div>
      </div>
    </div>
  )
}

