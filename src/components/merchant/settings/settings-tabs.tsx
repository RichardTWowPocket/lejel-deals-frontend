'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from './profile-form'
import { BusinessForm } from './business-form'
import { HoursForm } from './hours-form'
import { NotificationsForm } from './notifications-form'
import { PasswordForm } from './password-form'
import { User, Building2, Clock, Bell, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsTabsProps {
  className?: string
}

export function SettingsTabs({ className }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className={cn('w-full', className)}>
      <div className="w-full overflow-x-auto -mx-1 px-1">
        <TabsList className="inline-flex w-full flex-wrap sm:flex-nowrap gap-2 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2 flex-shrink-0">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2 flex-shrink-0">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2 flex-shrink-0">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Hours</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 flex-shrink-0">
            <Bell className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2 flex-shrink-0">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="profile" className="mt-6">
        <ProfileForm />
      </TabsContent>

      <TabsContent value="business" className="mt-6">
        <BusinessForm />
      </TabsContent>

      <TabsContent value="hours" className="mt-6">
        <HoursForm />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationsForm />
      </TabsContent>

      <TabsContent value="password" className="mt-6">
        <PasswordForm />
      </TabsContent>
    </Tabs>
  )
}



