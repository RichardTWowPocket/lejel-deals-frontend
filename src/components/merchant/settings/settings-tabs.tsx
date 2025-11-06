'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from './profile-form'
import { BusinessForm } from './business-form'
import { HoursForm } from './hours-form'
import { NotificationsForm } from './notifications-form'
import { PasswordForm } from './password-form'
import { useHasMerchantRole } from '@/hooks/use-has-merchant-role'
import { MerchantRole } from '@/lib/constants'
import { User, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsTabsProps {
  className?: string
}

export function SettingsTabs({ className }: SettingsTabsProps) {
  const { hasAccess: canManageProfile } = useHasMerchantRole([
    MerchantRole.OWNER,
    MerchantRole.ADMIN,
  ])

  // Default tab based on role - if can't manage profile, start with notifications/password
  const defaultTab = canManageProfile ? 'profile' : 'notifications'

  return (
    <Tabs defaultValue={defaultTab} className={cn('w-full', className)}>
      <div className="w-full overflow-x-auto -mx-1 px-1">
        <TabsList className="inline-flex w-full flex-wrap sm:flex-nowrap gap-2 h-auto">
          {canManageProfile && (
            <TabsTrigger value="profile" className="flex items-center gap-2 flex-shrink-0">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          )}
          {canManageProfile && (
            <TabsTrigger value="business" className="flex items-center gap-2 flex-shrink-0">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="notifications" className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline">Notifications & Password</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {canManageProfile && (
        <TabsContent value="profile" className="mt-6 space-y-6">
          <ProfileForm />
          <div className="border-t pt-6">
            <NotificationsForm />
          </div>
          <div className="border-t pt-6">
            <PasswordForm />
          </div>
        </TabsContent>
      )}

      {canManageProfile && (
        <TabsContent value="business" className="mt-6 space-y-6">
          <BusinessForm />
          <div className="border-t pt-6">
            <HoursForm />
          </div>
        </TabsContent>
      )}

      <TabsContent value="notifications" className="mt-6 space-y-6">
        <NotificationsForm />
        <div className="border-t pt-6">
          <PasswordForm />
        </div>
      </TabsContent>
    </Tabs>
  )
}


