'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { ScanLine, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface QRScannerProps {
  onScanSuccess: (qrToken: string) => void
  onScanError?: (error: string) => void
  onClose?: () => void
  className?: string
}

export function QRScanner({ onScanSuccess, onScanError, onClose, className }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'idle' | 'granted' | 'denied'>('idle')

  useEffect(() => {
    let mounted = true

    const startScanner = async () => {
      if (!containerRef.current || scannerRef.current) return

      try {
        // Check camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop()) // Stop immediately to check permission
        setCameraPermission('granted')

        const scanner = new Html5Qrcode(containerRef.current.id)
        
        await scanner.start(
          {
            facingMode: 'environment', // Use back camera on mobile
          },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (mounted) {
              onScanSuccess(decodedText)
              stopScanner()
            }
          },
          (errorMessage) => {
            // Ignore frequent error messages during scanning
            if (errorMessage.includes('No QR code found')) {
              return
            }
            if (mounted && onScanError) {
              onScanError(errorMessage)
            }
          }
        )

        if (mounted) {
          scannerRef.current = scanner
          setIsScanning(true)
          setError(null)
        }
      } catch (err: any) {
        if (mounted) {
          setCameraPermission('denied')
          setError(err.message || 'Failed to start camera')
          if (onScanError) {
            onScanError(err.message || 'Failed to start camera')
          }
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      stopScanner()
    }
  }, [onScanSuccess, onScanError])

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear()
          scannerRef.current = null
          setIsScanning(false)
        })
        .catch((err) => {
          console.error('Error stopping scanner:', err)
        })
    }
  }

  const handleClose = () => {
    stopScanner()
    onClose?.()
  }

  if (cameraPermission === 'denied') {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardContent className="p-6 text-center">
          <X className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Access Denied</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please enable camera permissions in your browser settings to scan QR codes.
          </p>
          {onClose && (
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div
        id="qr-scanner-container"
        ref={containerRef}
        className="relative w-full aspect-square bg-black rounded-lg overflow-hidden"
      >
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <ScanLine className="h-12 w-12 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-destructive text-center">{error}</div>
      )}

      {isScanning && (
        <div className="absolute top-4 right-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Position the QR code within the frame
        </p>
      </div>
    </div>
  )
}



