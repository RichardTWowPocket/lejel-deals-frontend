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
  const [copied, setCopied] = useState(false)
  const [showFullCode, setShowFullCode] = useState(false)
  const [qrToken, setQrToken] = useState('')
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const weekday = date.toLocaleDateString('id-ID', { weekday: 'long' })
    const day = date.getDate()
    const month = date.toLocaleDateString('id-ID', { month: 'long' })
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    
    // Capitalize first letter of weekday and month
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase()
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
    
    // Format: "Kamis, 1 Januari 2026 6.59"
    return `${capitalizedWeekday}, ${day} ${capitalizedMonth} ${year} ${hours}.${minutes.toString().padStart(2, '0')}`
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return '0 days'
    if (diffInDays === 1) return '1 day'
    if (diffInDays < 0) return '0 days'
    return `${diffInDays} days`
  }
  
  const formatVoucherValue = (amount: number) => {
    // Format: "Rp. 75.000" (with period after Rp and space)
    return `Rp. ${amount.toLocaleString('id-ID')}`
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
      <DialogContent className='max-w-[95vw] sm:max-w-md !w-[95vw] sm:!w-auto'>
        <DialogHeader className='px-0'>
          <DialogTitle className='flex items-center gap-2 text-base sm:text-lg'>
            <QrCode className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='text-sm sm:text-base'>Coupon QR Code</span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 sm:space-y-6 px-4 sm:px-6'>
          {/* Coupon Info */}
          <div className='text-center'>
            <h3 className='font-semibold text-base sm:text-lg mb-1 line-clamp-2'>{coupon.deal.title}</h3>
            <p className='text-xs sm:text-sm text-muted-foreground mb-2 truncate'>{coupon.deal.merchant.name}</p>
            <Badge className={`${statusInfo.bgColor} text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1`}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* QR Code Display */}
          <div className='flex flex-col items-center justify-center w-full'>
            {coupon.status === 'ACTIVE' ? (
              <div className='flex flex-col items-center space-y-3 sm:space-y-4 w-full'>
                {qrCodeImage ? (
                  <div className='bg-white p-2 sm:p-3 rounded-lg shadow-md flex items-center justify-center'>
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className='h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 block aspect-square object-contain'
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-48 sm:h-56 md:h-64 w-full'>
                    <RefreshCw className='h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground' />
                  </div>
                )}
                
                <div className='flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap w-full px-2'>
                  <span className='text-[10px] sm:text-xs font-mono break-all text-center'>
                    {showFullCode ? coupon.qrCode : `${coupon.qrCode.substring(0, 8)}••••${coupon.qrCode.substring(coupon.qrCode.length - 4)}`}
                  </span>
                  <div className='flex gap-1 sm:gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowFullCode(!showFullCode)}
                    className='h-7 w-7 sm:h-8 sm:w-8 p-0'
                    aria-label={showFullCode ? 'Hide code' : 'Show code'}
                  >
                    {showFullCode ? <EyeOff className='h-3.5 w-3.5 sm:h-4 sm:w-4' /> : <Eye className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyCode}
                    disabled={copied}
                    className='h-7 w-7 sm:h-8 sm:w-8 p-0'
                    aria-label='Copy code'
                  >
                    {copied ? <Check className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600' /> : <Copy className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
                  </Button>
                  </div>
                </div>

              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <div className='inline-block bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 rounded-lg mx-auto'>
                  <div className='text-center text-muted-foreground'>
                    <QrCode className='h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 mx-auto opacity-50 aspect-square' />
                    <p className='text-xs sm:text-sm mt-2'>{statusInfo.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Validity Info */}
          <div className='space-y-2 sm:space-y-3'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm'>
              <span className='text-muted-foreground lowercase'>expires in:&nbsp;</span>
              <span className='font-medium text-right sm:text-left break-words lowercase'> {formatRelativeDate(coupon.expiresAt)}</span>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm'>
              <span className='text-muted-foreground lowercase'>valid until:&nbsp;</span>
              <span className='font-medium text-right sm:text-left break-words'>{formatDate(coupon.expiresAt)}</span>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm'>
              <span className='text-muted-foreground lowercase'>voucher value:&nbsp;</span>
              <span className='font-medium text-right sm:text-left'>{formatVoucherValue(coupon.deal.discountPrice)}</span>
            </div>
            {coupon.status === 'USED' && coupon.usedAt && (
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Used on:</span>
                <span className='font-medium text-right sm:text-left break-words'>{formatDate(coupon.usedAt)}</span>
              </div>
            )}
          </div>


          {/* Countdown timer */}
          {coupon.status === 'ACTIVE' && countdown > 0 && (
            <div className='text-center pt-2'>
              <p className='text-[10px] sm:text-xs text-muted-foreground'>
                Refreshing in <span className='font-mono font-semibold text-primary'>{countdown}s</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}