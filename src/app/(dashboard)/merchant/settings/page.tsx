'use client'

import { SettingsTabs } from '@/components/merchant/settings/settings-tabs'
import { ErrorDisplay, PageHeaderSkeleton } from '@/components/merchant/shared'
import { useMerchantSettings } from '@/hooks/merchant'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useMerchantSettings()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Failed to load settings"
        description="We couldn't retrieve your settings. Please try again."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your merchant profile, business information, and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <SettingsTabs />
    </div>
  )
}



