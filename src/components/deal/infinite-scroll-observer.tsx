'use client'

import { useEffect, useRef } from 'react'

interface InfiniteScrollObserverProps {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
}

export function InfiniteScrollObserver({ 
  onIntersect, 
  enabled = true,
  rootMargin = '300px' 
}: InfiniteScrollObserverProps) {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    )

    const currentRef = observerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [onIntersect, enabled, rootMargin])

  return <div ref={observerRef} className='h-10 w-full' />
}

