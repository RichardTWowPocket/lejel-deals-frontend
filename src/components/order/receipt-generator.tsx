'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePayment } from '@/hooks/use-payment'
import { OrderStatusBadge } from '@/components/ui/order-status-badge'
import { PaymentReference } from '@/components/ui/payment-reference'
import { 
  Download,
  Printer,
  Share2,
  FileText,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  QrCode,
  RefreshCw
} from 'lucide-react'

interface ReceiptGeneratorProps {
  order: {
    id: string
    orderNumber: string
    status: string
    quantity: number
    totalAmount: number
    paymentMethod?: string
    paymentReference?: string
    createdAt: string
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
  onReceiptGenerated?: (receiptData: string) => void
}

export function ReceiptGenerator({ order, onReceiptGenerated }: ReceiptGeneratorProps) {
  const { formatCurrency, formatMethod } = usePayment()
  const [isGenerating, setIsGenerating] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateReceipt = async () => {
    setIsGenerating(true)
    
    try {
      // TODO: Implement actual receipt generation logic
      await new Promise(resolve => setTimeout(resolve, 1500)) // Mock delay
      
      // Generate receipt HTML content
      const receiptContent = receiptRef.current?.innerHTML || ''
      onReceiptGenerated?.(receiptContent)
      
      // Trigger download
      downloadReceipt()
    } catch (error) {
      console.error('Failed to generate receipt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReceipt = () => {
    if (!receiptRef.current) return
    
    const receiptContent = receiptRef.current.innerHTML
    const blob = new Blob([receiptContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt-${order.orderNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printReceipt = () => {
    if (!receiptRef.current) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .merchant-info { text-align: center; margin-bottom: 20px; }
              .order-details { margin-bottom: 20px; }
              .payment-info { border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${receiptRef.current.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt - ${order.orderNumber}`,
          text: `Receipt for order ${order.orderNumber} from ${order.deal.merchant.businessName}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing receipt:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const receiptText = `Receipt - ${order.orderNumber}\n${order.deal.merchant.businessName}\n${formatCurrency(order.totalAmount)}`
      await navigator.clipboard.writeText(receiptText)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Receipt Actions */}
      <div className='flex gap-2'>
        <Button
          onClick={generateReceipt}
          disabled={isGenerating}
          className='flex-1'
        >
          {isGenerating ? (
            <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
          ) : (
            <Download className='h-4 w-4 mr-2' />
          )}
          {isGenerating ? 'Generating...' : 'Download Receipt'}
        </Button>
        
        <Button
          variant='outline'
          onClick={printReceipt}
          disabled={isGenerating}
        >
          <Printer className='h-4 w-4 mr-2' />
          Print
        </Button>
        
        <Button
          variant='outline'
          onClick={shareReceipt}
          disabled={isGenerating}
        >
          <Share2 className='h-4 w-4 mr-2' />
          Share
        </Button>
      </div>

      {/* Receipt Preview */}
      <Card className='max-w-md mx-auto'>
        <CardContent className='p-6'>
          <div ref={receiptRef} className='receipt-preview'>
            {/* Receipt Header */}
            <div className='text-center border-b-2 border-gray-300 pb-4 mb-6'>
              <h1 className='text-2xl font-bold mb-2'>LEJEL DEALS</h1>
              <p className='text-sm text-gray-600'>Digital Receipt</p>
            </div>

            {/* Merchant Info */}
            <div className='text-center mb-6'>
              <h2 className='text-lg font-semibold mb-1'>{order.deal.merchant.businessName}</h2>
              {order.deal.merchant.address && (
                <p className='text-sm text-gray-600 mb-1'>{order.deal.merchant.address}</p>
              )}
              {order.deal.merchant.phone && (
                <p className='text-sm text-gray-600'>{order.deal.merchant.phone}</p>
              )}
            </div>

            {/* Order Details */}
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Order #</span>
                <span className='font-mono text-sm'>{order.orderNumber}</span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Date</span>
                <span className='text-sm'>{formatDate(order.createdAt)}</span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Status</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Item Details */}
            <div className='mb-6'>
              <h3 className='font-semibold mb-3'>Order Items</h3>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <div className='flex-1'>
                    <p className='font-medium'>{order.deal.title}</p>
                    <p className='text-sm text-gray-600'>Qty: {order.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>{formatCurrency(order.deal.dealPrice)}</p>
                    <p className='text-sm text-gray-600 line-through'>
                      {formatCurrency(order.deal.discountPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className='border-t border-gray-300 pt-4 mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Payment Method</span>
                <span className='text-sm'>{formatMethod(order.paymentMethod)}</span>
              </div>
              {order.paymentReference && (
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm text-gray-600'>Reference</span>
                  <span className='text-sm font-mono'>{order.paymentReference}</span>
                </div>
              )}
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Subtotal</span>
                <span className='text-sm'>{formatCurrency(order.deal.dealPrice * order.quantity)}</span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Discount</span>
                <span className='text-sm text-green-600'>
                  -{formatCurrency((order.deal.discountPrice - order.deal.dealPrice) * order.quantity)}
                </span>
              </div>
              <div className='flex justify-between items-center text-lg font-bold'>
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Coupons Info */}
            {order.coupons && order.coupons.length > 0 && (
              <div className='mb-6'>
                <h3 className='font-semibold mb-3'>Coupons Generated</h3>
                <div className='space-y-2'>
                  {order.coupons.map((coupon, index) => (
                    <div key={coupon.id} className='flex justify-between items-center text-sm'>
                      <span>Coupon #{index + 1}</span>
                      <Badge variant={coupon.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {coupon.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className='text-center text-xs text-gray-500'>
              <p>Thank you for your purchase!</p>
              <p className='mt-2'>Valid until: {formatDate(order.deal.validUntil)}</p>
              <p className='mt-2'>For support, contact us at support@lejeldeals.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
