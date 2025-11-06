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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useUpdateHours, useOperatingHours } from '@/hooks/merchant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Clock, Copy, Check } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { OperatingHoursDto } from '@/types/settings'

const hoursFormSchema = z.object({
  operatingHours: z.array(
    z.object({
      day: z.string(),
      openTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      closeTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      isOpen: z.boolean(),
    })
  ),
}).refine(
  (data) => {
    return data.operatingHours.every((hours) => {
      if (!hours.isOpen) return true
      const open = hours.openTime.split(':').map(Number)
      const close = hours.closeTime.split(':').map(Number)
      const openMinutes = open[0] * 60 + open[1]
      const closeMinutes = close[0] * 60 + close[1]
      return closeMinutes > openMinutes
    })
  },
  {
    message: 'Close time must be after open time',
    path: ['operatingHours'],
  }
)

type HoursFormValues = z.infer<typeof hoursFormSchema>

const DAYS = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
] as const

function getDefaultHours(): OperatingHoursDto[] {
  return DAYS.map((day) => ({
    day: day.key,
    openTime: '09:00',
    closeTime: '17:00',
    isOpen: day.key !== 'sunday',
  }))
}

export function HoursForm() {
  const { data: hoursData, isLoading } = useOperatingHours()
  const updateHours = useUpdateHours()
  const [copiedDay, setCopiedDay] = useState<string | null>(null)

  const defaultHours = getDefaultHours()

  const form = useForm<HoursFormValues>({
    resolver: zodResolver(hoursFormSchema),
    defaultValues: {
      operatingHours: defaultHours,
    },
  })

  // Load settings when available
  useEffect(() => {
    if (hoursData?.operatingHours) {
      // Ensure all days are present
      const loadedHours = hoursData.operatingHours
      const allHours = DAYS.map((day) => {
        const existing = loadedHours.find((h) => h.day === day.key)
        return existing || { day: day.key, openTime: '09:00', closeTime: '17:00', isOpen: false }
      })
      form.reset({ operatingHours: allHours })
    }
  }, [hoursData, form])

  const onSubmit = async (values: HoursFormValues) => {
    try {
      await updateHours.mutateAsync(values.operatingHours)
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  const copyHoursToAllDays = (sourceIndex: number) => {
    const sourceHours = form.getValues(`operatingHours.${sourceIndex}`)
    DAYS.forEach((_, index) => {
      if (index !== sourceIndex) {
        form.setValue(`operatingHours.${index}.openTime`, sourceHours.openTime)
        form.setValue(`operatingHours.${index}.closeTime`, sourceHours.closeTime)
        form.setValue(`operatingHours.${index}.isOpen`, sourceHours.isOpen)
      }
    })
    setCopiedDay(DAYS[sourceIndex].key)
    setTimeout(() => setCopiedDay(null), 2000)
  }

  const formatTime = (time: string) => {
    if (!time) return '--:--'
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const operatingHours = form.watch('operatingHours')

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Operating Hours</CardTitle>
            <CardDescription className="mt-1">
              Configure your business hours for each day of the week
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              {DAYS.map((day, index) => {
                const dayHours = operatingHours[index]
                const isOpen = dayHours?.isOpen ?? false

                return (
                  <div
                    key={day.key}
                    className={cn(
                      'group rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-sm',
                      isOpen && 'bg-muted/30'
                    )}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Day Label and Toggle */}
                      <div className="flex items-center gap-4">
                        <div className="flex min-w-[100px] sm:min-w-[120px] items-center gap-3">
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.isOpen`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-0 space-y-0">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0 ml-3 cursor-pointer font-medium">
                                  <span className="hidden sm:inline">{day.label}</span>
                                  <span className="sm:hidden">{day.short}</span>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Time Inputs */}
                        {isOpen ? (
                          <div className="flex flex-1 items-center gap-3">
                            <div className="flex flex-1 items-center gap-3">
                              <FormField
                                control={form.control}
                                name={`operatingHours.${index}.openTime`}
                                render={({ field }) => (
                                  <FormItem className="flex-1 max-w-[140px]">
                                    <FormLabel className="sr-only">Open Time</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="time"
                                        {...field}
                                        className="w-full font-mono text-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <span className="text-muted-foreground text-sm font-medium flex-shrink-0">to</span>
                              <FormField
                                control={form.control}
                                name={`operatingHours.${index}.closeTime`}
                                render={({ field }) => (
                                  <FormItem className="flex-1 max-w-[140px]">
                                    <FormLabel className="sr-only">Close Time</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="time"
                                        {...field}
                                        className="w-full font-mono text-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Badge variant="secondary" className="font-normal">
                              Closed
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Copy Button */}
                      {isOpen && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyHoursToAllDays(index)}
                          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100"
                          title={`Copy hours to all days`}
                        >
                          {copiedDay === day.key ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="sm:w-auto"
              >
                Reset
              </Button>
              <Button type="submit" disabled={updateHours.isPending} className="sm:w-auto">
                {updateHours.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Hours'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

