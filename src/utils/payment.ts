/**
 * Utility functions for payment-related operations
 */

/**
 * Masks a payment reference to show only the last few characters for security
 * @param reference - The payment reference to mask
 * @param visibleChars - Number of characters to show at the end (default: 4)
 * @param maskChar - Character to use for masking (default: '•')
 * @returns Masked payment reference
 * 
 * @example
 * maskPaymentReference('PAY1234567890') // Returns '••••••••7890'
 * maskPaymentReference('PAY1234567890', 6) // Returns '••••••7890'
 * maskPaymentReference('PAY1234567890', 4, '*') // Returns '********7890'
 */
export function maskPaymentReference(
  reference: string | null | undefined,
  visibleChars: number = 4,
  maskChar: string = '•'
): string {
  if (!reference || typeof reference !== 'string') {
    return '••••••••'
  }

  const trimmedRef = reference.trim()
  if (trimmedRef.length <= visibleChars) {
    return trimmedRef
  }

  const visiblePart = trimmedRef.slice(-visibleChars)
  const maskedPart = maskChar.repeat(trimmedRef.length - visibleChars)
  
  return maskedPart + visiblePart
}

/**
 * Formats payment method for display
 * @param method - The payment method string
 * @returns Formatted payment method name
 * 
 * @example
 * formatPaymentMethod('credit_card') // Returns 'Credit Card'
 * formatPaymentMethod('bca_va') // Returns 'BCA Virtual Account'
 * formatPaymentMethod('gopay') // Returns 'GoPay'
 */
export function formatPaymentMethod(method: string | null | undefined): string {
  if (!method || typeof method !== 'string') {
    return 'Unknown'
  }

  const methodMap: Record<string, string> = {
    // Credit/Debit Cards
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    
    // Virtual Accounts
    'bca_va': 'BCA Virtual Account',
    'bni_va': 'BNI Virtual Account',
    'bri_va': 'BRI Virtual Account',
    'permata_va': 'Permata Virtual Account',
    'echannel': 'Mandiri E-Channel',
    
    // E-Wallets
    'gopay': 'GoPay',
    'shopeepay': 'ShopeePay',
    'dana': 'DANA',
    'ovo': 'OVO',
    'linkaja': 'LinkAja',
    
    // QR Code
    'qris': 'QRIS',
    'qrcode': 'QR Code',
    
    // Bank Transfer
    'bank_transfer': 'Bank Transfer',
    'atm_transfer': 'ATM Transfer',
    
    // Other
    'cash': 'Cash',
    'cod': 'Cash on Delivery',
    'unknown': 'Unknown'
  }

  return methodMap[method.toLowerCase()] || method
}

/**
 * Gets payment method icon name for UI components
 * @param method - The payment method string
 * @returns Icon name for the payment method
 */
export function getPaymentMethodIcon(method: string | null | undefined): string {
  if (!method || typeof method !== 'string') {
    return 'CreditCard'
  }

  const iconMap: Record<string, string> = {
    // Credit/Debit Cards
    'credit_card': 'CreditCard',
    'debit_card': 'CreditCard',
    
    // Virtual Accounts
    'bca_va': 'Building2',
    'bni_va': 'Building2',
    'bri_va': 'Building2',
    'permata_va': 'Building2',
    'echannel': 'Building2',
    
    // E-Wallets
    'gopay': 'Smartphone',
    'shopeepay': 'Smartphone',
    'dana': 'Smartphone',
    'ovo': 'Smartphone',
    'linkaja': 'Smartphone',
    
    // QR Code
    'qris': 'QrCode',
    'qrcode': 'QrCode',
    
    // Bank Transfer
    'bank_transfer': 'Banknote',
    'atm_transfer': 'Banknote',
    
    // Other
    'cash': 'Banknote',
    'cod': 'Truck'
  }

  return iconMap[method.toLowerCase()] || 'CreditCard'
}

/**
 * Validates if a payment reference format is valid
 * @param reference - The payment reference to validate
 * @returns True if valid, false otherwise
 */
export function isValidPaymentReference(reference: string | null | undefined): boolean {
  if (!reference || typeof reference !== 'string') {
    return false
  }

  const trimmedRef = reference.trim()
  
  // Basic validation: at least 4 characters, alphanumeric
  return trimmedRef.length >= 4 && /^[A-Za-z0-9]+$/.test(trimmedRef)
}

/**
 * Formats currency for display
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'IDR')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(50000) // Returns 'Rp 50.000'
 * formatCurrency(50000, 'USD') // Returns '$50.00'
 */
export function formatCurrency(amount: number | string | null | undefined, currency: string = 'IDR'): string {
  if (amount === null || amount === undefined || amount === '') {
    return currency === 'IDR' ? 'Rp 0' : '$0.00'
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return currency === 'IDR' ? 'Rp 0' : '$0.00'
  }

  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

/**
 * Gets payment status color for UI components
 * @param status - The payment status
 * @returns Color class name for the status
 */
export function getPaymentStatusColor(status: string | null | undefined): string {
  if (!status || typeof status !== 'string') {
    return 'text-muted-foreground'
  }

  const statusMap: Record<string, string> = {
    'PENDING': 'text-warning',
    'PAID': 'text-success',
    'CANCELLED': 'text-destructive',
    'REFUNDED': 'text-muted-foreground',
    'FAILED': 'text-destructive',
    'EXPIRED': 'text-muted-foreground'
  }

  return statusMap[status.toUpperCase()] || 'text-muted-foreground'
}

/**
 * Gets payment status background color for UI components
 * @param status - The payment status
 * @returns Background color class name for the status
 */
export function getPaymentStatusBgColor(status: string | null | undefined): string {
  if (!status || typeof status !== 'string') {
    return 'bg-muted'
  }

  const statusMap: Record<string, string> = {
    'PENDING': 'bg-warning/10',
    'PAID': 'bg-success/10',
    'CANCELLED': 'bg-destructive/10',
    'REFUNDED': 'bg-muted',
    'FAILED': 'bg-destructive/10',
    'EXPIRED': 'bg-muted'
  }

  return statusMap[status.toUpperCase()] || 'bg-muted'
}
