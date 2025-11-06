'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useUpdateNotifications } from '@/hooks/merchant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const notificationsFormSchema = z.object({
  emailNewOrders: z.boolean().default(false),
  emailLowInventory: z.boolean().default(false),
  emailExpiringDeals: z.boolean().default(false),
  emailNewRedemptions: z.boolean().default(false),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export function NotificationsForm() {
  const updateNotifications = useUpdateNotifications()

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNewOrders: false,
      emailLowInventory: false,
      emailExpiringDeals: false,
      emailNewRedemptions: false,
    },
  })

  // Note: Backend doesn't have notifications endpoint yet
  // This will load from merchant settings when backend supports it
  // For now, we'll use default values

  const onSubmit = async (values: NotificationsFormValues) => {
    try {
      await updateNotifications.mutateAsync(values)
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which email notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* New Orders */}
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5 flex-1">
                  <FormField
                    control={form.control}
                    name="emailNewOrders"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            New Orders
                          </FormLabel>
                          <FormDescription>
                            Receive an email when a new order is placed
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Low Inventory */}
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5 flex-1">
                  <FormField
                    control={form.control}
                    name="emailLowInventory"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Low Inventory Alerts
                          </FormLabel>
                          <FormDescription>
                            Get notified when deal inventory is running low
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Expiring Deals */}
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5 flex-1">
                  <FormField
                    control={form.control}
                    name="emailExpiringDeals"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Expiring Deals
                          </FormLabel>
                          <FormDescription>
                            Receive alerts when deals are about to expire
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* New Redemptions */}
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5 flex-1">
                  <FormField
                    control={form.control}
                    name="emailNewRedemptions"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            New Redemptions
                          </FormLabel>
                          <FormDescription>
                            Get notified when customers redeem coupons
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateNotifications.isPending}>
                {updateNotifications.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}



