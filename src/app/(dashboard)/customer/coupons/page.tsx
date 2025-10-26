'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMyCoupons } from '@/hooks/use-coupons'
import { usePayment } from '@/hooks/use-payment'
import { CouponQRModal } from '@/components/coupon/coupon-qr-modal'
import { 
  Search, 
  Filter, 
  SortAsc,
  SortDesc,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'

type CouponStatus = 'ALL' | 'ACTIVE' | 'USED' | 'EXPIRED'
type SortOption = 'expiresAt' | 'createdAt' | 'merchant' | 'dealPrice'
type SortOrder = 'asc' | 'desc'

export default function CouponsPage() {
  const { data, isLoading } = useMyCoupons(1, 50) // Get more coupons for filtering
  const { formatCurrency } = usePayment()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CouponStatus>('ALL')
  const [merchantFilter, setMerchantFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('expiresAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [showExpiringSoon, setShowExpiringSoon] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  const coupons = data?.data || []
  const totalCoupons = data?.pagination?.total || 0

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter((coupon: any) => {
    const matchesSearch = searchQuery === '' || 
      coupon.deal?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.deal?.merchant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.order?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || coupon.status === statusFilter
    
    const matchesMerchant = merchantFilter === '' || 
      coupon.deal?.merchant?.name?.toLowerCase().includes(merchantFilter.toLowerCase())
    
    const matchesCity = cityFilter === '' || 
      coupon.deal?.merchant?.city?.toLowerCase().includes(cityFilter.toLowerCase())
    
    const matchesExpiringSoon = !showExpiringSoon || isExpiringSoon(coupon.expiresAt)
    
    return matchesSearch && matchesStatus && matchesMerchant && matchesCity && matchesExpiringSoon
  })

  // Sort coupons
  const sortedCoupons = [...filteredCoupons].sort((a: any, b: any) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'expiresAt':
        aValue = new Date(a.expiresAt).getTime()
        bValue = new Date(b.expiresAt).getTime()
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'merchant':
        aValue = a.deal?.merchant?.name || ''
        bValue = b.deal?.merchant?.name || ''
        break
      case 'dealPrice':
        aValue = Number(a.deal?.dealPrice) || 0
        bValue = Number(b.deal?.dealPrice) || 0
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
    ALL: totalCoupons,
    ACTIVE: coupons.filter((c: any) => c.status === 'ACTIVE').length,
    USED: coupons.filter((c: any) => c.status === 'USED').length,
    EXPIRED: coupons.filter((c: any) => c.status === 'EXPIRED').length,
  }

  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffInHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 48 && diffInHours > 0
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Expires today'
    if (diffInDays === 1) return 'Expires tomorrow'
    if (diffInDays < 0) return 'Expired'
    return `Expires in ${diffInDays} days`
  }

  const getCouponStatusInfo = (coupon: any) => {
    switch (coupon.status) {
      case 'ACTIVE':
        const isExpiring = isExpiringSoon(coupon.expiresAt)
        return {
          icon: isExpiring ? AlertCircle : CheckCircle,
          color: isExpiring ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400',
          bgColor: isExpiring ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30',
          label: 'Active',
          action: 'Show QR'
        }
      case 'USED':
        return {
          icon: CheckCircle,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          label: 'Used',
          action: 'View Details'
        }
      case 'EXPIRED':
        return {
          icon: XCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Expired',
          action: 'See Similar Deals'
        }
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Unknown',
          action: null
        }
    }
  }

  const getUniqueMerchants = () => {
    const merchants = coupons.map((c: any) => c.deal?.merchant?.name).filter(Boolean)
    return [...new Set(merchants)]
  }

  const getUniqueCities = () => {
    const cities = coupons.map((c: any) => c.deal?.merchant?.city).filter(Boolean)
    return [...new Set(cities)]
  }

  const handleShowQR = (coupon: any) => {
    setSelectedCoupon(coupon)
    setIsQRModalOpen(true)
  }

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false)
    setSelectedCoupon(null)
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        {/* Header */}
        <header className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Coupons</h1>
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
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search for coupons...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Status Tabs */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2'>
          {(['ALL', 'ACTIVE', 'USED', 'EXPIRED'] as CouponStatus[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size='sm'
              onClick={() => setStatusFilter(status)}
              className='whitespace-nowrap'
            >
              {status === 'ALL' ? 'All' : status}
              {statusCounts[status] > 0 && (
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {statusCounts[status]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className='flex items-center gap-4 overflow-x-auto pb-2'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filters:</span>
          </div>
          
          <Select value={merchantFilter || 'all'} onValueChange={(value) => setMerchantFilter(value === 'all' ? '' : value)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='All Merchants' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Merchants</SelectItem>
              {getUniqueMerchants().map((merchant) => (
                <SelectItem key={merchant} value={merchant}>{merchant}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={cityFilter || 'all'} onValueChange={(value) => setCityFilter(value === 'all' ? '' : value)}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='All Cities' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Cities</SelectItem>
              {getUniqueCities().map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={showExpiringSoon ? 'default' : 'outline'}
            size='sm'
            onClick={() => setShowExpiringSoon(!showExpiringSoon)}
          >
            <AlertCircle className='h-4 w-4 mr-2' />
            Expiring Soon
          </Button>
        </div>

        {/* Sort */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='expiresAt'>Expiry Date</SelectItem>
                <SelectItem value='createdAt'>Created Date</SelectItem>
                <SelectItem value='merchant'>Merchant</SelectItem>
                <SelectItem value='dealPrice'>Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant='outline'
            size='sm'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className='h-4 w-4' />
            ) : (
              <SortDesc className='h-4 w-4' />
            )}
          </Button>
        </div>

        {/* Coupons List */}
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
        ) : sortedCoupons.length === 0 ? (
          <Card className='border-dashed border-2 border-border/50 bg-muted/20'>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <QrCode className='h-16 w-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                {searchQuery || statusFilter !== 'ALL' ? 'No coupons found' : 'Belum ada kupon'}
              </h3>
              <p className='text-muted-foreground mb-4 max-w-md'>
                {searchQuery || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Mulai jelajahi promo dan lakukan pembelian untuk melihat kupon Anda di sini.'
                }
              </p>
              <Button asChild>
                <a href='/deals'>Lihat Promo Hari Ini</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {sortedCoupons.map((coupon: any) => {
              const statusInfo = getCouponStatusInfo(coupon)
              const isExpiring = isExpiringSoon(coupon.expiresAt)
              
              return (
                <Card key={coupon.id} className='hover:shadow-md transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-4'>
                      {/* Merchant Logo */}
                      <div className='flex-shrink-0'>
                        <div className='h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center'>
                          <span className='text-white font-bold text-lg'>
                            {coupon.deal?.merchant?.name?.charAt(0) || 'M'}
                          </span>
                        </div>
                      </div>

                      {/* Coupon Info */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <h3 className='font-semibold text-lg truncate'>
                                {coupon.deal?.merchant?.name || 'Merchant'}
                              </h3>
                              <span className='text-muted-foreground'>•</span>
                              <span className='text-muted-foreground truncate'>
                                {coupon.deal?.title || 'Deal'}
                              </span>
                            </div>
                            
                            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                              <span className='font-mono'>#{coupon.order?.orderNumber}</span>
                              <span>•</span>
                              <span>{formatRelativeDate(coupon.expiresAt)}</span>
                              <span>•</span>
                              <span>{coupon.deal?.merchant?.city}</span>
                            </div>
                            
                            <div className='flex items-center gap-2 text-sm'>
                              <span className='text-muted-foreground'>
                                Voucher value: {formatCurrency(coupon.deal?.discountPrice)}
                              </span>
                              {coupon.status === 'USED' && coupon.usedAt && (
                                <>
                                  <span className='text-muted-foreground'>•</span>
                                  <span className='text-muted-foreground'>
                                    Used {formatRelativeDate(coupon.usedAt)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Helper Text */}
                            {coupon.status === 'ACTIVE' && isExpiring && (
                              <div className='text-sm mt-2 text-yellow-600 dark:text-yellow-400'>
                                Expires soon - use before {new Date(coupon.expiresAt).toLocaleDateString('id-ID')}
                              </div>
                            )}
                          </div>

                          {/* Status and Actions */}
                          <div className='flex flex-col items-end gap-2 ml-4'>
                            <Badge 
                              variant={statusInfo.label === 'Active' ? 'default' : 'secondary'}
                              className={statusInfo.bgColor}
                            >
                              {statusInfo.label}
                            </Badge>
                            
                            <Button 
                              size='sm' 
                              variant={statusInfo.action === 'Show QR' ? 'default' : 'outline'}
                              onClick={statusInfo.action === 'Show QR' ? () => handleShowQR(coupon) : undefined}
                              asChild={statusInfo.action !== 'Show QR'}
                            >
                              {statusInfo.action === 'Show QR' ? (
                                <>
                                  <QrCode className='h-4 w-4 mr-1' />
                                  {statusInfo.action}
                                </>
                              ) : (
                                <a href={`/customer/coupons/${coupon.id}`}>
                                  {statusInfo.action}
                                </a>
                              )}
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

        {/* QR Modal */}
        {selectedCoupon && (
          <CouponQRModal
            coupon={selectedCoupon}
            isOpen={isQRModalOpen}
            onClose={handleCloseQRModal}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}


