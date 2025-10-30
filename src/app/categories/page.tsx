'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCategories } from '@/hooks/use-categories'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp } from 'lucide-react'

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/10 to-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5'>
        {/* Background decoration */}
        <div className='absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl' />
        <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl' />
        
        <div className='container relative mx-auto px-4 py-16'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl'>
              <span className='text-gradient-primary'>Jelajahi Berdasarkan Kategori</span>
            </h1>
            <p className='text-xl text-muted-foreground sm:text-2xl'>
              Temukan promo dari kategori favorit Anda
            </p>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-4 py-12'>
        {/* Error State */}
        {error && (
          <Card className='border-destructive/50 bg-destructive/5 p-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
              <svg
                className='h-8 w-8 text-destructive'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-xl font-semibold'>Unable to Load Categories</h3>
            <p className='mb-6 text-muted-foreground'>
              We&apos;re having trouble connecting to our servers. Please try again later.
            </p>
            <div className='flex flex-col gap-2 sm:flex-row sm:justify-center'>
              <Button onClick={() => window.location.reload()} variant='default'>
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant='outline'>
                Go to Homepage
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <Skeleton className='mb-4 h-16 w-16' />
                  <Skeleton className='mb-2 h-6 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Categories Grid */}
        {!isLoading && categories && Array.isArray(categories) && categories.length > 0 && (
          <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4'>
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className='group h-full transition-all duration-500 hover:shadow-elegant-xl border-border/50 bg-card/50 backdrop-blur-sm'>
                  <CardContent className='flex h-full flex-col items-center p-8 text-center'>
                    {/* Icon/Image */}
                    <div className='relative mb-6'>
                      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-primary/20 shadow-elegant-lg group-hover:shadow-elegant-xl'>
                        {category.imageUrl ? (
                          <div className='relative h-full w-full'>
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              className='rounded-full object-cover'
                            />
                          </div>
                        ) : (
                          <span className='text-3xl font-bold text-gradient-primary'>
                            {category.icon || category.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      {/* Glow effect */}
                      <div className='absolute -inset-2 rounded-full bg-gradient-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500' />
                    </div>

                    {/* Name */}
                    <h3 className='mb-3 text-xl font-bold transition-colors group-hover:text-gradient-primary leading-tight'>
                      {category.name}
                    </h3>

                    {/* Deal Count */}
                    {category._count?.deals && category._count.deals > 0 && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
                        <TrendingUp className='h-4 w-4' />
                        <span className='font-semibold'>{category._count.deals} deals</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {category.featured && (
                      <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 shadow-elegant-lg'>
                        ⭐ Featured
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!categories || !Array.isArray(categories) || categories.length === 0) && (
          <Card className='border-2 border-dashed p-12 text-center'>
            <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20'>
              <svg
                className='h-10 w-10 text-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-2xl font-bold'>No Categories Available Yet</h3>
            <p className='mb-6 text-muted-foreground'>
              Categories will be added soon to help you browse deals more easily
            </p>
            <Button onClick={() => (window.location.href = '/deals')}>Browse All Deals</Button>
          </Card>
        )}
      </div>
    </div>
  )
}

