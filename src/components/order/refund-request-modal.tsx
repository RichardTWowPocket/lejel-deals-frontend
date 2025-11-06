'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { usePayment } from '@/hooks/use-payment'
import { 
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface RefundRequestModalProps {
  order: {
    id: string
    orderNumber: string
    status: string
    totalAmount: number
    paymentMethod?: string
    paymentReference?: string
    deal: {
      title: string
      merchant: {
        businessName: string
      }
    }
  }
  onRefundRequested?: (refundData: RefundRequestData) => void
}

interface RefundRequestData {
  reason: string
  amount: number
  description: string
  contactMethod: string
  urgency: 'low' | 'medium' | 'high'
}

export function RefundRequestModal({ order, onRefundRequested }: RefundRequestModalProps) {
  const { formatCurrency } = usePayment()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refundData, setRefundData] = useState<RefundRequestData>({
    reason: '',
    amount: order.totalAmount,
    description: '',
    contactMethod: '',
    urgency: 'medium'
  })
  const [errors, setErrors] = useState<Partial<RefundRequestData>>({})

  const refundReasons = [
    { value: 'duplicate', label: 'Duplicate payment' },
    { value: 'cancelled', label: 'Order cancelled' },
    { value: 'defective', label: 'Defective product/service' },
    { value: 'not_as_described', label: 'Not as described' },
    { value: 'changed_mind', label: 'Changed mind' },
    { value: 'other', label: 'Other reason' }
  ]

  const urgencyOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  ]

  const validateForm = () => {
    const newErrors: Partial<RefundRequestData> = {}
    
    if (!refundData.reason) {
      newErrors.reason = 'Please select a reason for refund'
    }
    
    if (refundData.amount <= 0 || refundData.amount > order.totalAmount) {
      newErrors.amount = 'Amount must be between 0 and order total'
    }
    
    if (!refundData.description.trim()) {
      newErrors.description = 'Please provide a description'
    }
    
    if (!refundData.contactMethod.trim()) {
      newErrors.contactMethod = 'Please provide contact information'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // TODO: Implement actual refund request API call
      await new Promise(resolve => setTimeout(resolve, 2000)) // Mock delay
      
      onRefundRequested?.(refundData)
      setIsOpen(false)
      
      // Reset form
      setRefundData({
        reason: '',
        amount: order.totalAmount,
        description: '',
        contactMethod: '',
        urgency: 'medium'
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to submit refund request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRefundEligibility = () => {
    const now = new Date()
    const orderDate = new Date(order.deal.merchant.businessName) // Mock date
    
    // Mock eligibility logic
    if (order.status === 'CANCELLED') {
      return { eligible: true, message: 'Full refund available for cancelled orders' }
    }
    
    if (order.status === 'PAID') {
      return { eligible: true, message: 'Refund available within 7 days of purchase' }
    }
    
    return { eligible: false, message: 'Refund not available for this order status' }
  }

  const eligibility = getRefundEligibility()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={!eligibility.eligible}>
          <RefreshCw className='h-4 w-4 mr-2' />
          Request Refund
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <RefreshCw className='h-5 w-5' />
            Request Refund
          </DialogTitle>
        </DialogHeader>
        
        <div className='space-y-6'>
          {/* Order Summary */}
          <div className='bg-muted/50 p-4 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='font-semibold'>{order.deal.title}</h3>
              <Badge variant='outline'>{order.status}</Badge>
            </div>
            <p className='text-sm text-muted-foreground mb-2'>
              {order.deal.merchant.businessName} • Order #{order.orderNumber}
            </p>
            <div className='flex items-center gap-4 text-sm'>
              <span>Order Total: <strong>{formatCurrency(order.totalAmount)}</strong></span>
              <span>Payment: <strong>{order.paymentMethod}</strong></span>
            </div>
          </div>

          {/* Eligibility Check */}
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            eligibility.eligible 
              ? 'bg-success/10 border border-success/20' 
              : 'bg-destructive/10 border border-destructive/20'
          }`}>
            {eligibility.eligible ? (
              <CheckCircle className='h-5 w-5 text-success' />
            ) : (
              <XCircle className='h-5 w-5 text-destructive' />
            )}
            <div>
              <p className={`font-medium ${
                eligibility.eligible ? 'text-success' : 'text-destructive'
              }`}>
                {eligibility.eligible ? 'Refund Available' : 'Refund Not Available'}
              </p>
              <p className={`text-sm ${
                eligibility.eligible ? 'text-success/80' : 'text-destructive/80'
              }`}>
                {eligibility.message}
              </p>
            </div>
          </div>

          {eligibility.eligible && (
            <>
              {/* Refund Amount */}
              <div className='space-y-2'>
                <Label htmlFor='amount'>Refund Amount</Label>
                <div className='relative'>
                  <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='amount'
                    type='number'
                    value={refundData.amount}
                    onChange={(e) => setRefundData({ ...refundData, amount: parseFloat(e.target.value) || 0 })}
                    className='pl-10'
                    min='0'
                    max={order.totalAmount}
                    step='0.01'
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Maximum refundable amount: {formatCurrency(order.totalAmount)}
                </p>
                {errors.amount && (
                  <p className='text-xs text-red-600'>{errors.amount}</p>
                )}
              </div>

              {/* Refund Reason */}
              <div className='space-y-2'>
                <Label>Reason for Refund</Label>
                <div className='grid grid-cols-2 gap-2'>
                  {refundReasons.map((reason) => (
                    <Button
                      key={reason.value}
                      variant={refundData.reason === reason.value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setRefundData({ ...refundData, reason: reason.value })}
                      className='justify-start'
                    >
                      {reason.label}
                    </Button>
                  ))}
                </div>
                {errors.reason && (
                  <p className='text-xs text-red-600'>{errors.reason}</p>
                )}
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label htmlFor='description'>Additional Details</Label>
                <Textarea
                  id='description'
                  placeholder='Please provide more details about your refund request...'
                  value={refundData.description}
                  onChange={(e) => setRefundData({ ...refundData, description: e.target.value })}
                  rows={4}
                />
                {errors.description && (
                  <p className='text-xs text-red-600'>{errors.description}</p>
                )}
              </div>

              {/* Contact Method */}
              <div className='space-y-2'>
                <Label htmlFor='contact'>Preferred Contact Method</Label>
                <Input
                  id='contact'
                  placeholder='Email or phone number'
                  value={refundData.contactMethod}
                  onChange={(e) => setRefundData({ ...refundData, contactMethod: e.target.value })}
                />
                {errors.contactMethod && (
                  <p className='text-xs text-red-600'>{errors.contactMethod}</p>
                )}
              </div>

              {/* Urgency */}
              <div className='space-y-2'>
                <Label>Urgency Level</Label>
                <div className='flex gap-2'>
                  {urgencyOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={refundData.urgency === option.value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setRefundData({ ...refundData, urgency: option.value as any })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className='bg-muted/50 p-4 rounded-lg'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='h-5 w-5 text-blue-600 mt-0.5' />
                  <div className='text-sm'>
                    <p className='font-medium mb-2'>Refund Terms:</p>
                    <ul className='space-y-1 text-muted-foreground'>
                      <li>• Refunds will be processed within 3-5 business days</li>
                      <li>• Refund amount will be credited to your original payment method</li>
                      <li>• Processing fees may apply depending on payment method</li>
                      <li>• Refund requests are subject to merchant approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                      Submitting...
                    </>
                  ) : (
                    'Submit Refund Request'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
