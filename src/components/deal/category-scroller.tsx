'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

interface Category {
  id: string
  name: string
  icon: string
  color?: string
}

interface CategoryScrollerProps {
  categories: Category[]
  selectedCategoryId?: string
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryScroller({ categories, selectedCategoryId, onCategoryChange }: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    
    const scrollAmount = 300
    const currentScroll = scrollRef.current.scrollLeft
    
    if (direction === 'left') {
      scrollRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth',
      })
    } else {
      scrollRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className='relative'>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className='absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-elegant-lg transition-all hover:shadow-elegant-xl'
          aria-label='Scroll left'
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
      )}

      {/* Category Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='flex gap-3 overflow-x-auto scrollbar-hide py-2'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* All Categories Button */}
        <Button
          variant={!selectedCategoryId ? 'default' : 'outline'}
          size='sm'
          onClick={() => onCategoryChange(null)}
          className={cn(
            'h-20 w-20 shrink-0 flex-col gap-2 rounded-xl font-semibold transition-all duration-300',
            !selectedCategoryId
              ? 'bg-gradient-primary text-white shadow-elegant-lg hover:shadow-elegant-xl'
              : 'border-2 hover:bg-muted/50',
          )}
        >
          <span className='text-2xl'>🎯</span>
          <span className='text-xs'>All</span>
        </Button>

        {/* Category Buttons */}
        {categories.map((category) => {
          const isActive = selectedCategoryId === category.id

          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size='sm'
              onClick={() => onCategoryChange(isActive ? null : category.id)}
              className={cn(
                'h-20 w-20 shrink-0 flex-col gap-2 rounded-xl font-semibold transition-all duration-300',
                isActive
                  ? 'bg-gradient-primary text-white shadow-elegant-lg hover:shadow-elegant-xl'
                  : 'border-2 hover:bg-muted/50',
              )}
              style={{
                color: isActive ? undefined : category.color,
              }}
            >
              <span className='text-2xl'>{category.icon}</span>
              <span className='text-xs'>{category.name}</span>
            </Button>
          )
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className='absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-elegant-lg transition-all hover:shadow-elegant-xl'
          aria-label='Scroll right'
        >
          <ChevronRight className='h-5 w-5' />
        </button>
      )}
    </div>
  )
}

