'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { usePayment } from '@/hooks/use-payment'
import { OrderStatusBadge } from '@/components/ui/order-status-badge'
import { PaymentReference } from '@/components/ui/payment-reference'
import { RefundRequestModal } from '@/components/order/refund-request-modal'
import { ReceiptGenerator } from '@/components/order/receipt-generator'
import { ActivityTimeline } from '@/components/order/activity-timeline'
import { UserRole } from '@/lib/constants'
import { 
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  quantity: number
  totalAmount: number
  paymentMethod?: string
  paymentReference?: string
  createdAt: string
  updatedAt: string
  deal: {
    id: string
    title: string
    description?: string
    dealPrice: number
    discountPrice: number
    images: string[]
    validUntil: string
    merchant: {
      id: string
      businessName: string
      address?: string
      phone?: string
      logo?: string
      city?: string
    }
  }
  coupons?: Array<{
    id: string
    status: string
    expiresAt: string
    usedAt?: string
    qrCode: string
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { formatCurrency, formatMethod } = usePayment()
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/${params.id}`)
      // const data = await response.json()
      
      // Mock data for now
      setTimeout(() => {
        setOrder({
          id: params.id as string,
          orderNumber: 'ORD-2024-001234',
          status: 'PAID',
          quantity: 2,
          totalAmount: 150000,
          paymentMethod: 'bca_va',
          paymentReference: 'PAY1234567890',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:35:00Z',
          deal: {
            id: 'deal-1',
            title: 'Lunch Set Special',
            description: 'Delicious lunch set with main course and dessert',
            dealPrice: 75000,
            discountPrice: 100000,
            images: ['/images/deal1.jpg'],
            validUntil: '2024-02-15T23:59:59Z',
            merchant: {
              id: 'merchant-1',
              businessName: 'Pungbu BBQ',
              address: 'Jl. Setiabudi No. 123, Jakarta Selatan',
              phone: '+62 812-3456-7890',
              logo: '/images/pungbu-logo.jpg',
              city: 'Jakarta'
            }
          },
          coupons: [
            {
              id: 'coupon-1',
              status: 'ACTIVE',
              expiresAt: '2024-02-15T23:59:59Z',
              qrCode: 'QR123456789'
            },
            {
              id: 'coupon-2',
              status: 'USED',
              expiresAt: '2024-02-15T23:59:59Z',
              usedAt: '2024-01-20T14:30:00Z',
              qrCode: 'QR123456790'
            }
          ]
        })
        setIsLoading(false)
      }, 1000)
    }

    fetchOrder()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCopyOrderNumber = async () => {
    if (order) {
      try {
        await navigator.clipboard.writeText(order.orderNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy order number:', err)
      }
    }
  }

  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          message: 'Menunggu konfirmasi pembayaran',
          action: 'Continue Payment'
        }
      case 'PAID':
        return {
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          message: 'Pembayaran berhasil dikonfirmasi',
          action: 'View Coupons'
        }
      case 'CANCELLED':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          message: 'Pesanan dibatalkan',
          action: 'Buy Again'
        }
      case 'REFUNDED':
        return {
          icon: RefreshCw,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          message: 'Pengembalian dana berhasil',
          action: 'View Refund Details'
        }
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          message: 'Status tidak diketahui',
          action: null
        }
    }
  }

  const getCouponStatusCounts = () => {
    if (!order?.coupons) return { active: 0, used: 0, expired: 0, total: 0 }
    
    const active = order.coupons.filter(c => c.status === 'ACTIVE').length
    const used = order.coupons.filter(c => c.status === 'USED').length
    const expired = order.coupons.filter(c => c.status === 'EXPIRED').length
    
    return { active, used, expired, total: order.coupons.length }
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-64' />
          </div>
          
          <div className='grid gap-6'>
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-48' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-20 w-full' />
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!order) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
          </div>
          
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <AlertCircle className='h-16 w-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>Order not found</h3>
              <p className='text-muted-foreground mb-4'>
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button asChild>
                <a href='/customer/orders'>Back to Orders</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  const statusInfo = getOrderStatusInfo(order.status)
  const couponCounts = getCouponStatusCounts()

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>Order Details</h1>
              <p className='text-muted-foreground'>Order #{order.orderNumber}</p>
            </div>
          </div>
          
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleCopyOrderNumber}
              disabled={copied}
            >
              {copied ? (
                <Check className='h-4 w-4 mr-2' />
              ) : (
                <Copy className='h-4 w-4 mr-2' />
              )}
              {copied ? 'Copied!' : 'Copy Order #'}
            </Button>
            
            <RefundRequestModal 
              order={order}
              onRefundRequested={(refundData) => {
                console.log('Refund requested:', refundData)
                // TODO: Handle refund request
              }}
            />
          </div>
        </div>

        {/* Order Status */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
                <statusInfo.icon className={`h-6 w-6 ${statusInfo.color}`} />
              </div>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <OrderStatusBadge status={order.status} />
                  <span className={`text-sm ${statusInfo.color}`}>
                    {statusInfo.message}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Ordered on {formatDate(order.createdAt)}
                </p>
              </div>
              {statusInfo.action && (
                <Button size='sm' variant='outline'>
                  {statusInfo.action}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5' />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='h-16 w-16 rounded-lg bg-gradient-primary flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>
                  {order.deal.merchant.businessName.charAt(0)}
                </span>
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{order.deal.merchant.businessName}</h3>
                <p className='text-muted-foreground'>{order.deal.title}</p>
                <p className='text-sm text-muted-foreground'>
                  {order.quantity} × {formatCurrency(order.deal.dealPrice)}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-lg'>{formatCurrency(order.totalAmount)}</p>
                <p className='text-sm text-muted-foreground'>
                  Savings: {formatCurrency(order.deal.discountPrice - order.deal.dealPrice)}
                </p>
              </div>
            </div>
            
            <div className='border-t border-border my-4' />
            
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Order Date</p>
                <p className='font-medium'>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Valid Until</p>
                <p className='font-medium'>{formatDate(order.deal.validUntil)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Payment Method</p>
                <p className='font-medium'>{formatMethod(order.paymentMethod)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Payment Reference</p>
                <PaymentReference 
                  reference={order.paymentReference}
                  showToggle={true}
                  showCopy={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Merchant Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Merchant Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start gap-4'>
              <div className='h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center'>
                <span className='text-white font-bold'>
                  {order.deal.merchant.businessName.charAt(0)}
                </span>
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold'>{order.deal.merchant.businessName}</h3>
                <p className='text-sm text-muted-foreground'>{order.deal.merchant.address}</p>
                <p className='text-sm text-muted-foreground'>{order.deal.merchant.city}</p>
              </div>
            </div>
            
            {order.deal.merchant.phone && (
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <a 
                  href={`tel:${order.deal.merchant.phone}`}
                  className='text-sm text-blue-600 hover:underline'
                >
                  {order.deal.merchant.phone}
                </a>
              </div>
            )}
            
            <Button variant='outline' size='sm' className='w-fit'>
              <ExternalLink className='h-4 w-4 mr-2' />
              Get Directions
            </Button>
          </CardContent>
        </Card>

        {/* Coupons Information */}
        {couponCounts.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Coupons ({couponCounts.total})
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <p className='text-2xl font-bold text-green-600'>{couponCounts.active}</p>
                  <p className='text-sm text-muted-foreground'>Active</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-600'>{couponCounts.used}</p>
                  <p className='text-sm text-muted-foreground'>Used</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-600'>{couponCounts.expired}</p>
                  <p className='text-sm text-muted-foreground'>Expired</p>
                </div>
              </div>
              
              <Button asChild className='w-full'>
                <a href={`/customer/coupons?order=${order.id}`}>
                  View All Coupons
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Activity Timeline */}
        <ActivityTimeline orderId={order.id} />

        {/* Receipt Generator */}
        <ReceiptGenerator 
          order={order}
          onReceiptGenerated={(receiptData) => {
            console.log('Receipt generated:', receiptData)
            // TODO: Handle receipt generation
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
