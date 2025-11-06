'use client'

import { useState } from 'react'
import { QRScanner } from './qr-scanner'
import { ManualEntry } from './manual-entry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Keyboard, Camera, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScannerViewProps {
  onScanSuccess: (qrToken: string) => void
  onScanError?: (error: string) => void
  onClose?: () => void
  className?: string
}

export function ScannerView({ onScanSuccess, onScanError, onClose, className }: ScannerViewProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Scan QR Code</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-4 border-b">
        <Button
          variant={mode === 'camera' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setMode('camera')}
        >
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
        <Button
          variant={mode === 'manual' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setMode('manual')}
        >
          <Keyboard className="h-4 w-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      {/* Scanner or Manual Entry */}
      <div className="flex-1 overflow-auto p-4">
        {mode === 'camera' ? (
          <QRScanner
            onScanSuccess={onScanSuccess}
            onScanError={onScanError}
            onClose={onClose}
            className="w-full max-w-md mx-auto"
          />
        ) : (
          <ManualEntry
            onCodeSubmit={onScanSuccess}
            onError={onScanError}
            className="w-full max-w-md mx-auto"
          />
        )}
      </div>
    </div>
  )
}



