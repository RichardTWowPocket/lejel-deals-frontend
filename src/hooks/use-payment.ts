import { useMemo } from 'react'
import {
  maskPaymentReference,
  formatPaymentMethod,
  getPaymentMethodIcon,
  isValidPaymentReference,
  formatCurrency,
  getPaymentStatusColor,
  getPaymentStatusBgColor
} from '@/utils/payment'

/**
 * Hook for payment-related utilities
 */
export function usePayment() {
  return useMemo(() => ({
    /**
     * Mask a payment reference
     */
    maskReference: maskPaymentReference,
    
    /**
     * Format payment method name
     */
    formatMethod: formatPaymentMethod,
    
    /**
     * Get payment method icon
     */
    getMethodIcon: getPaymentMethodIcon,
    
    /**
     * Validate payment reference
     */
    isValidReference: isValidPaymentReference,
    
    /**
     * Format currency
     */
    formatCurrency,
    
    /**
     * Get payment status color
     */
    getStatusColor: getPaymentStatusColor,
    
    /**
     * Get payment status background color
     */
    getStatusBgColor: getPaymentStatusBgColor
  }), [])
}

/**
 * Hook for formatting order payment information
 */
export function useOrderPayment(order: {
  paymentMethod?: string | null
  paymentReference?: string | null
  totalAmount?: number | null
  status?: string | null
}) {
  return useMemo(() => {
    const { formatMethod, maskReference, formatCurrency, getStatusColor, getStatusBgColor } = usePayment()
    
    return {
      formattedMethod: formatMethod(order.paymentMethod),
      maskedReference: maskReference(order.paymentReference),
      formattedAmount: formatCurrency(order.totalAmount),
      statusColor: getStatusColor(order.status),
      statusBgColor: getStatusBgColor(order.status)
    }
  }, [order.paymentMethod, order.paymentReference, order.totalAmount, order.status])
}
