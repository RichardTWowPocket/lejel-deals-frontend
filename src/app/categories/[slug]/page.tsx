'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useCategory } from '@/hooks/use-categories'
import { useDeals } from '@/hooks/use-deals'
import { DealCard } from '@/components/deal/deal-card'
import { DealCardSkeleton } from '@/components/deal/deal-card-skeleton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DealFilters } from '@/types/deal'

export default function CategoryDealsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: category, isLoading: categoryLoading } = useCategory(slug)
  
  const [filters, setFilters] = useState<DealFilters>({
    page: 1,
    limit: 12,
    status: 'active' as any,
  })

  const { data: dealsData, isLoading: dealsLoading } = useDeals({
    ...filters,
    categoryId: category?.id,
  })

  if (categoryLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8 h-24 w-full animate-pulse rounded-lg bg-muted' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card className='p-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold'>Category not found</h2>
          <Button asChild className='mt-4'>
            <Link href='/categories'>Browse All Categories</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      {/* Category Header */}
      <section className='border-b bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10'>
        <div className='container mx-auto px-4 py-12'>
          <Button variant='ghost' asChild className='mb-4 gap-2'>
            <Link href='/categories'>
              <ArrowLeft className='h-4 w-4' />
              All Categories
            </Link>
          </Button>
          
          <div className='mx-auto max-w-3xl'>
            <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
              {category.name}
            </h1>
            {category.description && (
              <p className='text-lg text-muted-foreground'>{category.description}</p>
            )}
            <p className='mt-4 text-sm text-muted-foreground'>
              {dealsData?.pagination.total || 0} deals available
            </p>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <div className='container mx-auto px-4 py-8'>
        {dealsLoading && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!dealsLoading && dealsData && (
          <>
            {dealsData.deals.length === 0 ? (
              <Card className='p-12 text-center'>
                <h3 className='mb-2 text-xl font-semibold'>No deals available</h3>
                <p className='mb-4 text-muted-foreground'>
                  No active deals in this category at the moment
                </p>
                <Button asChild>
                  <Link href='/deals'>Browse All Deals</Link>
                </Button>
              </Card>
            ) : (
              <>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {dealsData.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>

                {/* Pagination */}
                {dealsData.pagination.totalPages > 1 && (
                  <div className='mt-8 flex items-center justify-center gap-2'>
                    <Button
                      variant='outline'
                      disabled={filters.page === 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
                    >
                      Previous
                    </Button>
                    <span className='px-4 text-sm text-muted-foreground'>
                      Page {filters.page} of {dealsData.pagination.totalPages}
                    </span>
                    <Button
                      variant='outline'
                      disabled={filters.page === dealsData.pagination.totalPages}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

