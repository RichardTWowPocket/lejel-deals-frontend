'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Keyboard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const manualEntrySchema = z.object({
  qrToken: z.string().min(10, 'QR code must be at least 10 characters'),
})

type ManualEntryFormValues = z.infer<typeof manualEntrySchema>

interface ManualEntryProps {
  onCodeSubmit: (qrToken: string) => void
  onError?: (error: string) => void
  className?: string
}

export function ManualEntry({ onCodeSubmit, onError, className }: ManualEntryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ManualEntryFormValues>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      qrToken: '',
    },
  })

  async function onSubmit(values: ManualEntryFormValues) {
    setIsSubmitting(true)
    try {
      // Validate that it looks like a JWT token
      const tokenParts = values.qrToken.trim().split('.')
      if (tokenParts.length !== 3) {
        form.setError('qrToken', {
          message: 'Invalid QR code format. Please scan the QR code or enter the complete token.',
        })
        setIsSubmitting(false)
        return
      }

      await onCodeSubmit(values.qrToken.trim())
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Failed to process QR code')
      }
      form.setError('qrToken', {
        message: error.message || 'Failed to process QR code',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    form.setValue('qrToken', pastedText, { shouldValidate: true })
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Enter QR Code Manually
        </CardTitle>
        <CardDescription>
          If the camera scan fails, you can manually enter the QR code token here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="qrToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code Token</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or type the QR code token (JWT format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                      className="min-h-[120px] font-mono text-sm"
                      onPaste={handlePaste}
                      {...field}
                      error={form.formState.errors.qrToken?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Verify QR Code
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}



