'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { maskPaymentReference, isValidPaymentReference } from '@/utils/payment'
import { cn } from '@/lib/utils'

interface PaymentReferenceProps {
  reference: string | null | undefined
  visibleChars?: number
  maskChar?: string
  showToggle?: boolean
  showCopy?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PaymentReference({
  reference,
  visibleChars = 4,
  maskChar = '•',
  showToggle = true,
  showCopy = true,
  className,
  size = 'md'
}: PaymentReferenceProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!reference || !isValidPaymentReference(reference)) {
    return (
      <span className={cn('text-muted-foreground', className)}>
        {maskChar.repeat(8)}
      </span>
    )
  }

  const displayReference = isVisible ? reference : maskPaymentReference(reference, visibleChars, maskChar)
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy payment reference:', err)
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-mono', sizeClasses[size])}>
        {displayReference}
      </span>
      
      {showToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          className="h-6 w-6 p-0 hover:bg-muted/50"
          title={isVisible ? 'Hide reference' : 'Show reference'}
        >
          {isVisible ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      )}
      
      {showCopy && isVisible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 hover:bg-muted/50"
          title={copied ? 'Copied!' : 'Copy reference'}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  )
}

interface PaymentMethodBadgeProps {
  method: string | null | undefined
  className?: string
}

export function PaymentMethodBadge({ method, className }: PaymentMethodBadgeProps) {
  if (!method) {
    return (
      <Badge variant="outline" className={className}>
        Unknown
      </Badge>
    )
  }

  const getMethodVariant = (method: string) => {
    const methodLower = method.toLowerCase()
    
    if (methodLower.includes('va') || methodLower.includes('virtual')) {
      return 'secondary'
    }
    
    if (methodLower.includes('wallet') || methodLower.includes('gopay') || methodLower.includes('shopeepay')) {
      return 'default'
    }
    
    if (methodLower.includes('credit') || methodLower.includes('debit')) {
      return 'outline'
    }
    
    return 'secondary'
  }

  const getMethodIcon = (method: string) => {
    const methodLower = method.toLowerCase()
    
    if (methodLower.includes('va') || methodLower.includes('virtual')) {
      return '🏦'
    }
    
    if (methodLower.includes('gopay')) {
      return '🟢'
    }
    
    if (methodLower.includes('shopeepay')) {
      return '🟠'
    }
    
    if (methodLower.includes('credit') || methodLower.includes('debit')) {
      return '💳'
    }
    
    return '💰'
  }

  return (
    <Badge variant={getMethodVariant(method)} className={className}>
      <span className="mr-1">{getMethodIcon(method)}</span>
      {method.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  )
}
