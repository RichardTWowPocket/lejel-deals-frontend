'use client'

import { use } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Globe, Clock, Mail, CheckCircle2, Star } from 'lucide-react'
import { useMerchant } from '@/hooks/use-merchants'
import { useDeals } from '@/hooks/use-deals'
import { DealCard } from '@/components/deal/deal-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MerchantProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: merchant, isLoading } = useMerchant(slug)
  const { data: dealsData } = useDeals({ merchantId: merchant?.id, status: 'active' as any })

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <Skeleton className='h-64 w-full' />
        <div className='container mx-auto px-4 py-8'>
          <Skeleton className='mb-4 h-8 w-48' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card className='p-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold'>Merchant not found</h2>
          <Button asChild className='mt-4'>
            <Link href='/merchants'>Browse All Merchants</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todayHours = merchant.openingHours?.[dayOfWeek as keyof typeof merchant.openingHours]

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      {/* Banner Section */}
      <div className='relative h-64 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20'>
        {merchant.bannerUrl ? (
          <Image src={merchant.bannerUrl} alt={merchant.businessName} fill className='object-cover' />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <span className='text-9xl font-bold text-muted-foreground/10'>
              {merchant.businessName.charAt(0)}
            </span>
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

        {/* Back Button */}
        <div className='absolute left-4 top-4'>
          <Button variant='secondary' asChild className='gap-2 shadow-lg'>
            <Link href='/merchants'>
              <ArrowLeft className='h-4 w-4' />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        {/* Merchant Header */}
        <div className='-mt-16 mb-8'>
          <Card className='shadow-xl'>
            <CardContent className='p-6'>
              <div className='flex flex-col gap-6 md:flex-row md:items-start'>
                {/* Logo */}
                <div className='relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border-4 border-background bg-white shadow-lg'>
                  {merchant.logoUrl ? (
                    <Image src={merchant.logoUrl} alt={merchant.businessName} fill className='object-cover' />
                  ) : (
                    <div className='flex h-full items-center justify-center bg-primary/10'>
                      <span className='text-4xl font-bold text-primary'>
                        {merchant.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className='flex-1'>
                  <div className='mb-2 flex flex-wrap items-center gap-2'>
                    <h1 className='text-3xl font-bold'>{merchant.businessName}</h1>
                    {merchant.verified && (
                      <Badge className='flex items-center gap-1 bg-green-500 text-white'>
                        <CheckCircle2 className='h-3 w-3' />
                        Verified
                      </Badge>
                    )}
                    {merchant.featured && (
                      <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white'>
                        Featured
                      </Badge>
                    )}
                  </div>

                  {merchant.rating && (
                    <div className='mb-3 flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(merchant.rating!)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='font-semibold'>{merchant.rating.toFixed(1)}</span>
                      {merchant.reviewCount && (
                        <span className='text-sm text-muted-foreground'>
                          ({merchant.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {merchant.description && (
                    <p className='mb-4 text-muted-foreground'>{merchant.description}</p>
                  )}

                  {/* Contact Info Grid */}
                  <div className='grid gap-3 text-sm md:grid-cols-2'>
                    <div className='flex items-start gap-2'>
                      <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                      <span>
                        {merchant.address}, {merchant.city}, {merchant.province} {merchant.postalCode}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-primary' />
                      <a href={`tel:${merchant.phone}`} className='hover:underline'>
                        {merchant.phone}
                      </a>
                    </div>
                    {merchant.email && (
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 text-primary' />
                        <a href={`mailto:${merchant.email}`} className='hover:underline'>
                          {merchant.email}
                        </a>
                      </div>
                    )}
                    {merchant.website && (
                      <div className='flex items-center gap-2'>
                        <Globe className='h-4 w-4 text-primary' />
                        <a
                          href={merchant.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:underline'
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Today's Hours */}
                {todayHours && (
                  <Card className='w-full bg-primary/5 md:w-auto'>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Clock className='h-4 w-4 text-primary' />
                        <div>
                          <p className='font-medium'>Today's Hours</p>
                          <p className='text-muted-foreground'>{todayHours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='deals' className='mb-8'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='deals'>Active Deals ({dealsData?.deals.length || 0})</TabsTrigger>
            <TabsTrigger value='info'>Information</TabsTrigger>
          </TabsList>

          <TabsContent value='deals' className='mt-6'>
            {dealsData && dealsData.deals.length > 0 ? (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {dealsData.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <Card className='p-12 text-center'>
                <h3 className='mb-2 text-xl font-semibold'>No active deals</h3>
                <p className='text-muted-foreground'>
                  This merchant doesn't have any active deals at the moment
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='info' className='mt-6'>
            <div className='grid gap-6 lg:grid-cols-2'>
              {/* Opening Hours */}
              {merchant.openingHours && (
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                      <Clock className='h-5 w-5 text-primary' />
                      Opening Hours
                    </h3>
                    <div className='space-y-2 text-sm'>
                      {Object.entries(merchant.openingHours).map(([day, hours]) => (
                        <div key={day} className='flex justify-between'>
                          <span className='capitalize font-medium'>{day}</span>
                          <span className='text-muted-foreground'>{hours || 'Closed'}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <Card>
                <CardContent className='p-6'>
                  <h3 className='mb-4 text-lg font-semibold'>Statistics</h3>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Total Deals</p>
                      <p className='text-2xl font-bold'>{merchant._count?.deals || 0}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Total Orders</p>
                      <p className='text-2xl font-bold'>{merchant._count?.orders || 0}+</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Member Since</p>
                      <p className='font-medium'>
                        {new Date(merchant.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

