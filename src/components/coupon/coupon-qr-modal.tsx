'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [countdown, setCountdown] = useState(60)

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

  const generateQRToken = useCallback(async () => {
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
  }, [coupon.id, coupon.qrCode, coupon.order.orderNumber])

  useEffect(() => {
    if (isOpen && coupon.status === 'ACTIVE') {
      generateQRToken()
      setCountdown(60) // Reset countdown to 60 seconds
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 60 // Reset to 60 when it reaches 0
          }
          return prev - 1
        })
      }, 1000) // Update every 1 second

      // Auto-refresh QR code every 60 seconds
      const refreshInterval = setInterval(() => {
        generateQRToken()
        setCountdown(60) // Reset countdown after refresh
      }, 60000) // 60 seconds

      // Cleanup intervals on close or unmount
      return () => {
        clearInterval(refreshInterval)
        clearInterval(countdownInterval)
      }
    }
  }, [isOpen, coupon.status, generateQRToken])

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
          <div className='flex justify-center'>
            {coupon.status === 'ACTIVE' ? (
              <div className='space-y-4'>
                {qrCodeImage ? (
                  <div className='inline-block bg-white p-3 rounded-lg'>
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className='h-64 w-64'
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center'>
                    <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
                  </div>
                )}
                
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

              </div>
            ) : (
              <div className='inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-lg'>
                <div className='text-center text-muted-foreground'>
                  <QrCode className='h-64 w-64 mx-auto opacity-50' />
                  <p className='text-sm mt-2'>{statusInfo.message}</p>
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


          {/* Countdown timer */}
          {coupon.status === 'ACTIVE' && countdown > 0 && (
            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Refreshing in <span className='font-mono font-semibold text-primary'>{countdown}s</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}