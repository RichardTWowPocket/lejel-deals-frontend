'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useMerchant } from '@/lib/merchant-context'
import { useCreateDeal } from '@/hooks/merchant/use-create-deal'
import { useUpdateDeal } from '@/hooks/merchant'
import { useMerchantDeal } from '@/hooks/merchant/use-merchant-deals'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useCategories } from '@/hooks/use-categories'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormSkeleton } from '@/components/merchant/shared'

// Form validation schema
const dealFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  dealPrice: z.number().min(1, 'Deal price must be greater than 0'),
  discountPrice: z.number().min(1, 'Discount price must be greater than 0'),
  categoryId: z.string().optional(),
  validFrom: z.date({
    required_error: 'Valid from date is required',
  }),
  validUntil: z.date({
    required_error: 'Valid until date is required',
  }),
  maxQuantity: z.number().min(1, 'Max quantity must be at least 1').optional().nullable(),
  images: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one image is required').max(5, 'Maximum 5 images'),
  terms: z.string().max(1000, 'Terms must be less than 1000 characters').optional(),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT'),
}).refine((data) => {
  return data.discountPrice > data.dealPrice
}, {
  message: 'Discount price must be greater than deal price',
  path: ['discountPrice'],
}).refine((data) => {
  return data.validUntil > data.validFrom
}, {
  message: 'Valid until must be after valid from',
  path: ['validUntil'],
})

type DealFormValues = z.infer<typeof dealFormSchema>

interface DealFormProps {
  mode: 'create' | 'edit'
  dealId?: string
}

/**
 * Deal Form Component
 * 
 * Comprehensive form for creating/editing deals with validation.
 * Includes image URLs, pricing, dates, and inventory management.
 * 
 * @example
 * ```tsx
 * <DealForm mode="create" />
 * <DealForm mode="edit" dealId="deal-123" />
 * ```
 */
export function DealForm({ mode, dealId }: DealFormProps) {
  const router = useRouter()
  const { activeMerchantId } = useMerchant()
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : []
  const { data: deal, isLoading: isLoadingDeal } = useMerchantDeal(dealId)
  const createDeal = useCreateDeal()
  const updateDeal = useUpdateDeal()

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dealPrice: 0,
      discountPrice: 0,
      categoryId: undefined,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxQuantity: null,
      images: [''],
      terms: '',
      featured: false,
      status: 'DRAFT',
    },
  })

  // Load deal data for edit mode
  useEffect(() => {
    if (mode === 'edit' && deal) {
      form.reset({
        title: deal.title,
        description: deal.description || '',
        dealPrice: deal.dealPrice,
        discountPrice: deal.discountPrice,
        categoryId: deal.categoryId || undefined,
        validFrom: new Date(deal.validFrom),
        validUntil: new Date(deal.validUntil),
        maxQuantity: deal.maxQuantity || null,
        images: deal.images && deal.images.length > 0 ? deal.images : [''],
        terms: deal.terms || '',
        featured: deal.featured || false,
        status: deal.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
      })
    }
  }, [mode, deal, form])

  // Calculate discount percentage
  const discountPercentage = form.watch('discountPrice') > 0 && form.watch('dealPrice') > 0
    ? ((form.watch('discountPrice') - form.watch('dealPrice')) / form.watch('discountPrice')) * 100
    : 0

  const onSubmit = async (values: DealFormValues) => {
    if (!activeMerchantId) {
      form.setError('root', { message: 'No merchant selected' })
      return
    }

    // Filter out empty image URLs
    const images = values.images.filter((url) => url.trim() !== '')

    // Exclude 'featured' field as it doesn't exist in the backend CreateDealDto
    const { featured, ...restValues } = values

    const dealData: any = {
      ...restValues,
      images,
      merchantId: activeMerchantId,
      validFrom: values.validFrom.toISOString(),
      validUntil: values.validUntil.toISOString(),
    }

    // Only include maxQuantity if it's a valid number (not null/undefined)
    if (dealData.maxQuantity == null) {
      delete dealData.maxQuantity
    }

    if (mode === 'create') {
      createDeal.mutate(dealData as any)
    } else if (dealId) {
      updateDeal.mutate({ id: dealId, data: dealData })
    }
  }

  const isLoading = isLoadingDeal || createDeal.isPending || updateDeal.isPending

  if (mode === 'edit' && isLoadingDeal) {
    return <FormSkeleton fields={8} />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="50% Off Pizza Special" {...field} />
              </FormControl>
              <FormDescription>
                A clear, descriptive title for your deal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Get 50% off on all pizza orders..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed description of the deal (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dealPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Price (Customer Pays) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Price customer pays for this deal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Value (Original Price) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Original value of the voucher</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Discount Percentage Display */}
        {discountPercentage > 0 && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <span className="font-medium">Discount: </span>
            <span className="text-success">{discountPercentage.toFixed(0)}%</span>
            <span className="text-muted-foreground ml-2">
              (Save {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(form.watch('discountPrice') - form.watch('dealPrice'))})
            </span>
          </div>
        )}

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
                disabled={categoriesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="empty" disabled>No categories available</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>Category for this deal (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Validity Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid From *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When this deal becomes available</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid Until *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When this deal expires</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Inventory */}
        <FormField
          control={form.control}
          name="maxQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Maximum number of deals available. Leave empty for unlimited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs *</FormLabel>
              <FormDescription>
                Add image URLs (up to 5). You can upload images via the Media Library.
              </FormDescription>
              <div className="space-y-2">
                {field.value.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => {
                        const newImages = [...field.value]
                        newImages[index] = e.target.value
                        field.onChange(newImages)
                      }}
                    />
                    {field.value.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newImages = field.value.filter((_, i) => i !== index)
                          field.onChange(newImages)
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {field.value.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      field.onChange([...field.value, ''])
                    }}
                  >
                    Add Image URL
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms & Conditions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Valid for dine-in and takeaway only..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Terms and conditions for this deal (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status & Featured */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Initial status for this deal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Deal</FormLabel>
                  <FormDescription>
                    Show this deal in featured section
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Deal'
              : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}


