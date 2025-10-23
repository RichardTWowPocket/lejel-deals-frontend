'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface NotificationsPreviewProps {
  preferences?: {
    whatsapp: boolean
    email: boolean
    sms: boolean
    push: boolean
  }
  onToggle?: (channel: string, enabled: boolean) => void
}

export function NotificationsPreview({ preferences, onToggle }: NotificationsPreviewProps) {
  const [localPreferences, setLocalPreferences] = useState(
    preferences || {
      whatsapp: true,
      email: true,
      sms: false,
      push: true,
    }
  )

  const handleToggle = (channel: keyof typeof localPreferences) => {
    const newValue = !localPreferences[channel]
    setLocalPreferences((prev) => ({
      ...prev,
      [channel]: newValue,
    }))
    onToggle?.(channel, newValue)
  }

  const channels = [
    {
      key: 'whatsapp' as const,
      label: 'WhatsApp',
      icon: MessageCircle,
      description: 'Notifikasi melalui WhatsApp',
    },
    {
      key: 'email' as const,
      label: 'Email',
      icon: Mail,
      description: 'Notifikasi melalui email',
    },
    {
      key: 'sms' as const,
      label: 'SMS',
      icon: Smartphone,
      description: 'Notifikasi melalui SMS',
    },
    {
      key: 'push' as const,
      label: 'Push',
      icon: Bell,
      description: 'Notifikasi push',
    },
  ]

  const activeChannels = Object.values(localPreferences).filter(Boolean).length

  return (
    <Card className='border-border/50 bg-card/50 shadow-elegant backdrop-blur-sm'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5 text-primary' />
              Notifikasi
            </CardTitle>
            <CardDescription>
              {activeChannels} dari {channels.length} saluran aktif
            </CardDescription>
          </div>
          <Button asChild variant='ghost' size='sm'>
            <Link href='/customer/notifications'>Kelola</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {channels.map((channel) => {
          const Icon = channel.icon
          return (
            <div key={channel.key} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                  <Icon className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <div className='font-medium'>{channel.label}</div>
                  <div className='text-xs text-muted-foreground'>{channel.description}</div>
                </div>
              </div>
              <Switch
                checked={localPreferences[channel.key]}
                onCheckedChange={() => handleToggle(channel.key)}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}


