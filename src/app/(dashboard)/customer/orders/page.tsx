'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { useCustomerOrders } from '@/hooks/use-orders'
import { usePayment } from '@/hooks/use-payment'
import { OrderStatusBadge } from '@/components/ui/order-status-badge'
import { UserRole } from '@/lib/constants'
import Link from 'next/link'
import { 
  Search, 
  ShoppingBag, 
  ArrowRight,
  Plus,
  SortAsc,
  SortDesc,
} from 'lucide-react'

type OrderStatus = 'ALL' | 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED'
type SortOption = 'createdAt' | 'totalAmount' | 'merchant' | 'status'
type SortOrder = 'asc' | 'desc'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data, isLoading } = useCustomerOrders(user?.id || '')
  const { formatCurrency } = usePayment()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('ALL')
  const [merchantFilter, setMerchantFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const orders = data?.data || []
  const totalOrders = data?.pagination?.total || 0

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deal?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deal?.merchant?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    const matchesMerchant = merchantFilter === '' || 
      order.deal?.merchant?.businessName?.toLowerCase().includes(merchantFilter.toLowerCase())
    
    const matchesCity = cityFilter === '' || 
      order.deal?.merchant?.city?.toLowerCase().includes(cityFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesMerchant && matchesCity
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a: any, b: any) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'totalAmount':
        aValue = Number(a.totalAmount) || 0
        bValue = Number(b.totalAmount) || 0
        break
      case 'merchant':
        aValue = a.deal?.merchant?.businessName || ''
        bValue = b.deal?.merchant?.businessName || ''
        break
      case 'status':
        aValue = a.status || ''
        bValue = b.status || ''
        break
      default:
        return 0
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const statusCounts = {
    ALL: totalOrders,
    PENDING: orders.filter((o: any) => o.status === 'PENDING').length,
    PAID: orders.filter((o: any) => o.status === 'PAID').length,
    REFUNDED: orders.filter((o: any) => o.status === 'REFUNDED').length,
    CANCELLED: orders.filter((o: any) => o.status === 'CANCELLED').length,
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hari ini'
    if (diffInDays === 1) return 'Kemarin'
    if (diffInDays < 7) return `${diffInDays} hari lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const getCouponSummary = (order: any) => {
    const coupons = order.coupons || []
    const active = coupons.filter((c: any) => c.status === 'ACTIVE').length
    const used = coupons.filter((c: any) => c.status === 'USED').length
    const expired = coupons.filter((c: any) => c.status === 'EXPIRED').length
    
    return { active, used, expired, total: coupons.length }
  }

  const getUniqueMerchants = () => {
    const merchants = orders.map((o: any) => o.deal?.merchant?.businessName).filter(Boolean)
    return [...new Set(merchants)]
  }

  const getUniqueCities = () => {
    const cities = orders.map((o: any) => o.deal?.merchant?.city).filter(Boolean)
    return [...new Set(cities)]
  }

  const getOrderHelperText = (order: any) => {
    const couponSummary = getCouponSummary(order)
    
    switch (order.status) {
      case 'PENDING':
        return {
          text: 'Menunggu konfirmasi pembayaran…',
          action: 'Continue Payment',
          color: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'PAID':
        if (couponSummary.active > 0) {
          const nearestExpiry = order.coupons
            ?.filter((c: any) => c.status === 'ACTIVE')
            ?.sort((a: any, b: any) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0]
          
          if (nearestExpiry) {
            const daysLeft = Math.ceil((new Date(nearestExpiry.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            return {
              text: `Ada ${couponSummary.active} kupon yang belum dipakai. Berlaku hingga ${daysLeft}d lagi`,
              action: null,
              color: 'text-blue-600 dark:text-blue-400'
            }
          }
        }
        return null
      case 'REFUNDED':
        return {
          text: 'Pengembalian dana dikirim ke metode pembayaran Anda.',
          action: null,
          color: 'text-gray-600 dark:text-gray-400'
        }
      default:
        return null
    }
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div>
        {/* Header */}
        <header className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Orders</h1>
              <p className='text-muted-foreground'>
                Today is {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Button asChild className='bg-gradient-primary hover:bg-gradient-primary/90'>
              <a href='/deals'>
                <Plus className='mr-2 h-4 w-4' />
                Browse Deals
              </a>
            </Button>
          </div>
        </header>

        {/* Search */}
        <div className='relative mt-4 md:mt-6'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search for orders...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Status Tabs, Filters, and Sort */}
        <div className='flex flex-wrap items-center justify-between py-1'>
          {/* Status Tabs */}
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-1'>
            {(['ALL', 'PENDING', 'PAID', 'REFUNDED', 'CANCELLED'] as OrderStatus[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter(status)}
                className='whitespace-nowrap'
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                {statusCounts[status] > 0 && (
                  <Badge variant='secondary' className='ml-2 text-xs'>
                    {statusCounts[status]}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Filters and Sort */}
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-1'>
            <Select value={merchantFilter || 'all'} onValueChange={(value) => setMerchantFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className='h-8 px-3 text-xs whitespace-nowrap'>
                <SelectValue placeholder='All Merchants' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-[100]'>
                <SelectItem value='all' className='text-xs'>All Merchants</SelectItem>
                {getUniqueMerchants().map((merchant) => (
                  <SelectItem key={merchant} value={merchant} className='text-xs'>
                    {merchant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={cityFilter || 'all'} onValueChange={(value) => setCityFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className='h-8 px-3 text-xs whitespace-nowrap'>
                <SelectValue placeholder='All Cities' />
              </SelectTrigger>
              <SelectContent position='popper' className='z-[100]'>
                <SelectItem value='all' className='text-xs'>All Cities</SelectItem>
                {getUniqueCities().map((city) => (
                  <SelectItem key={city} value={city} className='text-xs'>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='inline-flex h-8 items-center justify-between rounded-md border border-input bg-background text-xs ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className='h-8 px-2 rounded-l-md rounded-r-none border-0 border-r border-input shadow-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0'
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className='h-4 w-4' />
                ) : (
                  <SortDesc className='h-4 w-4' />
                )}
              </Button>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className='h-8 px-3 text-xs border-0 rounded-l-none rounded-r-md bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 whitespace-nowrap hover:bg-transparent [&>svg]:opacity-50'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent position='popper' className='z-[100]'>
                  <SelectItem value='createdAt' className='text-xs'>Order Date</SelectItem>
                  <SelectItem value='totalAmount' className='text-xs'>Total Amount</SelectItem>
                  <SelectItem value='merchant' className='text-xs'>Merchant</SelectItem>
                  <SelectItem value='status' className='text-xs'>Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-12 w-12 rounded-lg' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-3 w-1/2' />
                      <Skeleton className='h-3 w-1/4' />
                    </div>
                    <div className='text-right space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-8 w-24' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <Card className='border-dashed border-2 border-border/50 bg-muted/20 mt-6'>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <ShoppingBag className='h-16 w-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchQuery || statusFilter !== 'ALL' ? 'No orders found' : 'Belum ada pesanan'}
              </h3>
              <p className='text-muted-foreground mb-4 max-w-md'>
                {searchQuery || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Mulai jelajahi promo dan lakukan pembelian untuk melihat pesanan Anda di sini.'
                }
              </p>
              <Button asChild className='bg-gradient-primary hover:bg-gradient-primary/90'>
                <Link href='/deals'>Lihat deals sekarang</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {sortedOrders.map((order: any) => {
              const helperText = getOrderHelperText(order)
              const couponSummary = getCouponSummary(order)
              
              return (
                <Card key={order.id} className='hover:shadow-md transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-4'>
                      {/* Merchant Logo */}
                      <div className='flex-shrink-0'>
                        <div className='h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center'>
                          <span className='text-white font-bold text-lg'>
                            {order.deal?.merchant?.businessName?.charAt(0) || 'M'}
                          </span>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <h3 className='font-semibold text-lg truncate'>
                                {order.deal?.merchant?.businessName || 'Merchant'}
                              </h3>
                              <span className='text-muted-foreground'>•</span>
                              <span className='text-muted-foreground truncate'>
                                {order.deal?.title || 'Deal'}
                              </span>
                            </div>
                            
                            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                              <span className='font-mono'>#{order.orderNumber}</span>
                              <span>•</span>
                              <span>{formatRelativeDate(order.createdAt)}</span>
                              <span>•</span>
                              <span>{order.createdAt}</span>
                            </div>
                            
                            <div className='flex items-center gap-2 text-sm'>
                              <span className='text-muted-foreground'>
                                {order.quantity} × {formatCurrency(order.deal?.dealPrice)}
                              </span>
                              <ArrowRight className='h-3 w-3 text-muted-foreground' />
                              <span className='font-semibold'>
                                {formatCurrency(order.totalAmount)}
                              </span>
                              {couponSummary.total > 0 && (
                                <>
                                  <span className='text-muted-foreground'>•</span>
                                  <span className='text-muted-foreground'>
                                    {couponSummary.total} coupon{couponSummary.total > 1 ? 's' : ''}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Helper Text */}
                            {helperText && (
                              <div className={`text-sm mt-2 ${helperText.color}`}>
                                {helperText.text}
                              </div>
                            )}
                          </div>

                          {/* Status and Actions */}
                          <div className='flex flex-col items-end gap-2 ml-4'>
                            <OrderStatusBadge status={order.status} />
                            {helperText?.action && (
                              <Button size='sm' variant='outline'>
                                {helperText.action}
                              </Button>
                            )}
                            <Button asChild size='sm' variant='ghost'>
                              <Link href={`/customer/orders/${order.id}`}>
                                View Detail
                                <ArrowRight className='ml-1 h-3 w-3' />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}


