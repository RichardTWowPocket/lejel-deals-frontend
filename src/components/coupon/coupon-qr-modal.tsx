'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePayment } from '@/hooks/use-payment'
import { signQRCodeJWT } from '@/utils/qr-code'
import * as QRCode from 'qrcode'
import { 
  QrCode,
  Copy,
  Check,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface CouponQRModalProps {
  coupon: {
    id: string
    qrCode: string
    status: string
    expiresAt: string
    usedAt?: string
    deal: {
      title: string
      description?: string
      discountPrice: number
      validUntil: string
      merchant: {
        id: string
        name: string
        address?: string
        phone?: string
        city?: string
      }
    }
    order: {
      orderNumber: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

export function CouponQRModal({ coupon, isOpen, onClose }: CouponQRModalProps) {
  const { formatCurrency } = usePayment()
  const [copied, setCopied] = useState(false)
  const [showFullCode, setShowFullCode] = useState(false)
  const [qrToken, setQrToken] = useState('')
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Expires today'
    if (diffInDays === 1) return 'Expires tomorrow'
    if (diffInDays < 0) return 'Expired'
    return `Expires in ${diffInDays} days`
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy QR code:', err)
    }
  }

  const generateQRToken = async () => {
    setIsGenerating(true)
    try {
      // Generate QR code JWT token using the existing QR code utility
      const qrPayload = {
        customerId: 'customer-id', // TODO: Get from user context
        couponId: coupon.id,
        orderId: coupon.order.orderNumber,
        qrCode: coupon.qrCode
      }
      
      const token = await signQRCodeJWT(qrPayload)
      setQrToken(token)
      
      // Generate QR code image from the token
      const qrImageDataURL = await QRCode.toDataURL(token, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeImage(qrImageDataURL)
    } catch (error) {
      console.error('Failed to generate QR token:', error)
      setQrToken(coupon.qrCode) // Fallback to original QR code
      
      // Generate QR code image from original QR code as fallback
      try {
        const qrImageDataURL = await QRCode.toDataURL(coupon.qrCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeImage(qrImageDataURL)
      } catch (qrError) {
        console.error('Failed to generate QR code image:', qrError)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (isOpen && coupon.status === 'ACTIVE') {
      generateQRToken()
    }
  }, [isOpen, coupon.status])

  const getStatusInfo = () => {
    switch (coupon.status) {
      case 'ACTIVE':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          label: 'Active',
          message: 'Ready to redeem'
        }
      case 'USED':
        return {
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          label: 'Used',
          message: 'Already redeemed'
        }
      case 'EXPIRED':
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Expired',
          message: 'No longer valid'
        }
      default:
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Unknown',
          message: 'Status unknown'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <QrCode className='h-5 w-5' />
            Coupon QR Code
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Coupon Info */}
          <div className='text-center'>
            <h3 className='font-semibold text-lg mb-1'>{coupon.deal.title}</h3>
            <p className='text-sm text-muted-foreground mb-2'>{coupon.deal.merchant.name}</p>
            <Badge className={statusInfo.bgColor}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* QR Code Display */}
          <div className='text-center'>
            {coupon.status === 'ACTIVE' ? (
              <div className='space-y-4'>
                <div className='bg-white p-6 rounded-lg border-2 border-dashed border-gray-300'>
                  {qrCodeImage ? (
                    <div className='flex flex-col items-center gap-2'>
                      <img 
                        src={qrCodeImage} 
                        alt="QR Code" 
                        className='h-32 w-32'
                      />
                      <p className='text-xs text-muted-foreground'>QR Code Generated</p>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center gap-2'>
                      <QrCode className='h-32 w-32 mx-auto text-gray-400' />
                      <p className='text-sm text-muted-foreground'>Generating QR Code...</p>
                    </div>
                  )}
                </div>
                
                <div className='flex items-center justify-center gap-2'>
                  <span className='text-sm font-mono'>
                    {showFullCode ? coupon.qrCode : `${coupon.qrCode.substring(0, 8)}••••${coupon.qrCode.substring(coupon.qrCode.length - 4)}`}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowFullCode(!showFullCode)}
                    className='h-6 w-6 p-0'
                  >
                    {showFullCode ? <EyeOff className='h-3 w-3' /> : <Eye className='h-3 w-3' />}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyCode}
                    disabled={copied}
                    className='h-6 w-6 p-0'
                  >
                    {copied ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                  </Button>
                </div>

                {isGenerating && (
                  <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                    <RefreshCw className='h-4 w-4 animate-spin' />
                    Generating QR token...
                  </div>
                )}
              </div>
            ) : (
              <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg'>
                <div className='text-center text-muted-foreground'>
                  <QrCode className='h-16 w-16 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>{statusInfo.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Validity Info */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Expires:</span>
              <span className='font-medium'>{formatRelativeDate(coupon.expiresAt)}</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Valid until:</span>
              <span className='font-medium'>{formatDate(coupon.expiresAt)}</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Voucher value:</span>
              <span className='font-medium'>{formatCurrency(coupon.deal.discountPrice)}</span>
            </div>
            {coupon.status === 'USED' && coupon.usedAt && (
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Used on:</span>
                <span className='font-medium'>{formatDate(coupon.usedAt)}</span>
              </div>
            )}
          </div>

          {/* How to Redeem */}
          {coupon.status === 'ACTIVE' && (
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
              <h4 className='font-medium text-sm mb-2'>How to redeem:</h4>
              <ol className='text-sm text-muted-foreground space-y-1'>
                <li>1. Show this QR code to the cashier</li>
                <li>2. Cashier may ask for the last 4 digits of your phone</li>
                <li>3. After successful redemption, status will change to "Used"</li>
              </ol>
            </div>
          )}

          {/* Merchant Info */}
          <div className='space-y-3'>
            <h4 className='font-medium text-sm'>Merchant Information</h4>
            <div className='space-y-2 text-sm'>
              {coupon.deal.merchant.address && (
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span>{coupon.deal.merchant.address}</span>
                </div>
              )}
              {coupon.deal.merchant.phone && (
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-muted-foreground' />
                  <a 
                    href={`tel:${coupon.deal.merchant.phone}`}
                    className='text-blue-600 hover:underline'
                  >
                    {coupon.deal.merchant.phone}
                  </a>
                </div>
              )}
            </div>
            
            {coupon.deal.merchant.address && (
              <Button variant='outline' size='sm' className='w-full'>
                <ExternalLink className='h-4 w-4 mr-2' />
                Get Directions
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              Close
            </Button>
            {coupon.status === 'ACTIVE' && (
              <Button onClick={generateQRToken} disabled={isGenerating} className='flex-1'>
                {isGenerating ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <RefreshCw className='h-4 w-4 mr-2' />
                )}
                Refresh QR
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}