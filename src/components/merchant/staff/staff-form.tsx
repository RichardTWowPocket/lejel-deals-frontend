'use client'

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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCreateStaff } from '@/hooks/merchant/use-create-staff'
import { useUpdateStaff } from '@/hooks/merchant/use-update-staff'
import { Staff } from '@/types/staff'
import { StaffRole as StaffRoleEnum } from '@/lib/constants'
import { Key, Loader2 } from 'lucide-react'
import { useState } from 'react'

// Base schema for all fields
const staffFormBaseSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.nativeEnum(StaffRoleEnum).optional(),
})

// Schema with PIN (for creating)
const staffFormSchemaWithPin = staffFormBaseSchema.extend({
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN must be at most 6 digits')
    .regex(/^\d+$/, 'PIN must contain only digits'),
})

// Schema without PIN (for editing)
const staffFormSchemaWithoutPin = staffFormBaseSchema.extend({
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN must be at most 6 digits')
    .regex(/^\d+$/, 'PIN must contain only digits')
    .optional()
    .or(z.literal('')),
})

type StaffFormValuesWithPin = z.infer<typeof staffFormSchemaWithPin>
type StaffFormValuesWithoutPin = z.infer<typeof staffFormSchemaWithoutPin>
type StaffFormValues = StaffFormValuesWithPin | StaffFormValuesWithoutPin

interface StaffFormProps {
  staff?: Staff | null
  onSuccess?: () => void
}

export function StaffForm({ staff, onSuccess }: StaffFormProps) {
  const isEditing = !!staff
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()
  const [showPin, setShowPin] = useState(false)

  // Use different schema based on edit mode
  const formSchema = isEditing ? staffFormSchemaWithoutPin : staffFormSchemaWithPin

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      pin: '', // PIN is optional for editing
      role: staff?.role || StaffRoleEnum.CASHIER,
    },
  })

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    form.setValue('pin', pin)
    setShowPin(true)
  }

  const onSubmit = async (values: StaffFormValues) => {
    if (isEditing && staff) {
      // For editing, PIN is optional (only update if provided)
      const updateData: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        role: values.role,
      }
      
      // Only include PIN if it's provided and not empty
      if (values.pin && typeof values.pin === 'string' && values.pin.length >= 4) {
        updateData.pin = values.pin
      }

      await updateStaff.mutateAsync({
        id: staff.id,
        data: updateData,
      })
    } else {
      // For creating, PIN is required
      if (!values.pin || (typeof values.pin === 'string' && values.pin.length < 4)) {
        form.setError('pin', { message: 'PIN is required for new staff (4-6 digits)' })
        return
      }
      await createStaff.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        pin: values.pin as string,
        role: values.role || StaffRoleEnum.CASHIER,
      })
    }

    onSuccess?.()
  }

  const isLoading = createStaff.isPending || updateStaff.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+6281234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value as StaffRoleEnum)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={StaffRoleEnum.CASHIER}>Cashier</SelectItem>
                    <SelectItem value={StaffRoleEnum.SUPERVISOR}>Supervisor</SelectItem>
                    <SelectItem value={StaffRoleEnum.MANAGER}>Manager</SelectItem>
                    <SelectItem value={StaffRoleEnum.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type={showPin ? 'text' : 'password'}
                        placeholder="1234"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateRandomPin}
                      title="Generate random PIN"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                  {showPin && field.value && (
                    <p className="text-xs text-muted-foreground">
                      Generated PIN: {field.value}
                    </p>
                  )}
                </FormItem>
              )}
            />
          ) : (
            <FormItem>
              <FormLabel>PIN</FormLabel>
              <div className="text-sm text-muted-foreground pt-2">
                To change PIN, use the &quot;Reset PIN&quot; option from the actions menu.
              </div>
            </FormItem>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Staff' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
