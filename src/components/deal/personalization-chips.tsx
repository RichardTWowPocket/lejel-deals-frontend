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
    <div className='flex flex-wrap gap-3 py-4'>
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
              'group h-10 rounded-xl px-4 font-semibold transition-all duration-300',
              isActive
                ? 'bg-gradient-primary text-white shadow-elegant-lg hover:shadow-elegant-xl'
                : 'border-2 hover:bg-muted/50 hover:border-primary/50',
            )}
            title={chip.description}
          >
            <Icon className={cn('mr-2 h-4 w-4 transition-transform group-hover:scale-110', isActive && 'text-white')} />
            {chip.label}
          </Button>
        )
      })}
    </div>
  )
}

