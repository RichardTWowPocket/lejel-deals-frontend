'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles, MapPin, Clock, TrendingUp, Tag } from 'lucide-react'

export type PersonalizationFilter = 'for-you' | 'near-me' | 'ending-soon' | 'popular' | 'new'

interface PersonalizationChipsProps {
  activeFilter: PersonalizationFilter | null
  onFilterChange: (filter: PersonalizationFilter | null) => void
}

export function PersonalizationChips({ activeFilter, onFilterChange }: PersonalizationChipsProps) {
  const chips = [
    {
      id: 'for-you' as PersonalizationFilter,
      label: 'For you',
      icon: Sparkles,
      description: 'Personalized recommendations',
    },
    {
      id: 'near-me' as PersonalizationFilter,
      label: 'Near me',
      icon: MapPin,
      description: 'Deals nearby',
    },
    {
      id: 'ending-soon' as PersonalizationFilter,
      label: 'Ending soon',
      icon: Clock,
      description: 'Ending in 24h',
    },
    {
      id: 'popular' as PersonalizationFilter,
      label: 'Popular',
      icon: TrendingUp,
      description: 'Most bought',
    },
    {
      id: 'new' as PersonalizationFilter,
      label: 'New',
      icon: Tag,
      description: 'Latest deals',
    },
  ]

  return (
    <div className='overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0'>
      <div className='flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap'>
        {chips.map((chip) => {
          const Icon = chip.icon
          const isActive = activeFilter === chip.id

          return (
            <Button
              key={chip.id}
              variant={isActive ? 'default' : 'outline'}
              size='sm'
              onClick={() => onFilterChange(isActive ? null : chip.id)}
              className={cn(
                'group h-9 sm:h-10 rounded-lg sm:rounded-xl px-3 sm:px-4 font-medium transition-all duration-300 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap',
                isActive
                  ? 'bg-gradient-primary text-white shadow-elegant-lg hover:shadow-elegant-xl'
                  : 'border-2 hover:bg-muted/50 hover:border-primary/50',
              )}
              title={chip.description}
            >
              <Icon className={cn('mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110', isActive && 'text-white')} />
              {chip.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

