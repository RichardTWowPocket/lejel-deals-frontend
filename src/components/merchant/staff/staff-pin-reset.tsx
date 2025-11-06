'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useResetPin } from '@/hooks/merchant/use-reset-pin'
import { Staff } from '@/types/staff'
import { Key, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface StaffPinResetProps {
  staff: Staff | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffPinReset({ staff, open, onOpenChange }: StaffPinResetProps) {
  const resetPin = useResetPin()
  const [copied, setCopied] = useState(false)
  const [newPin, setNewPin] = useState<string | null>(null)

  const handleReset = async () => {
    if (!staff) return

    try {
      const result = await resetPin.mutateAsync(staff.id)
      setNewPin(result.newPin)
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleCopy = () => {
    if (newPin) {
      navigator.clipboard.writeText(newPin)
      setCopied(true)
      toast.success('PIN copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setNewPin(null)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {newPin ? 'New PIN Generated' : 'Reset Staff PIN'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {newPin ? (
              <div className="space-y-4">
                <p>
                  A new PIN has been generated for{' '}
                  <strong>
                    {staff?.firstName} {staff?.lastName}
                  </strong>
                  . Please share this PIN with the staff member securely.
                </p>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <code className="text-2xl font-mono font-bold flex-1 text-center">
                    {newPin}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    title="Copy PIN"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ This PIN will only be shown once. Make sure to save it securely.
                </p>
              </div>
            ) : (
              <>
                Are you sure you want to reset the PIN for{' '}
                <strong>
                  {staff?.firstName} {staff?.lastName}
                </strong>
                ? A new PIN will be generated and displayed.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {newPin ? (
            <AlertDialogAction onClick={handleClose}>Done</AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                disabled={resetPin.isPending}
              >
                {resetPin.isPending ? 'Resetting...' : 'Reset PIN'}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



