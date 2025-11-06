'use client'

import { useState } from 'react'
import { Search, X, Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useMerchantFilters } from '@/hooks/use-merchant-filters'
import type { OrderFilters } from '@/types/order'
import { OrderStatus } from '@/lib/constants'
import { useMerchantDeals } from '@/hooks/merchant'
import { DealStatus } from '@/types/deal'
import type { DealListResponse } from '@/types/deal'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface OrderFiltersProps {
  className?: string
}

/**
 * Order Filters Component
 * 
 * Filter bar for orders with date range, status, deal, and customer search filters.
 * Filters are synced with URL for shareable/bookmarkable links.
 */
export function OrderFilters({ className }: OrderFiltersProps) {
  const { filters, updateFilters, clearFilters } = useMerchantFilters<OrderFilters>({
    defaults: {
      page: 1,
      limit: 10,
      status: undefined,
      dealId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    },
  })

  // Get deals for deal filter dropdown
  const { data: dealsData } = useMerchantDeals({ status: DealStatus.ACTIVE })
  const deals = (dealsData as DealListResponse | undefined)?.deals || []

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.startDate && filters.endDate) {
      return {
        from: new Date(filters.startDate),
        to: new Date(filters.endDate),
      }
    }
    // Default to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    return {
      from: thirtyDaysAgo,
      to: today,
    }
  })

  const hasActiveFilters =
    filters.status ||
    filters.dealId ||
    filters.search ||
    filters.startDate ||
    filters.endDate

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    updateFilters({
      startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
      page: 1,
    })
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* First Row: Search and Status */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number, customer name or email..."
            value={filters.search || ''}
            onChange={(e) =>
              updateFilters({ search: e.target.value || undefined, page: 1 })
            }
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            updateFilters({
              status: value === 'all' ? undefined : (value as OrderStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.PAID}>Paid</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
            <SelectItem value={OrderStatus.REFUNDED}>Refunded</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Second Row: Date Range and Deal */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full md:w-[300px] justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Deal Filter */}
        <Select
          value={filters.dealId || 'all'}
          onValueChange={(value) =>
            updateFilters({ dealId: value === 'all' ? undefined : value, page: 1 })
          }
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filter by Deal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deals</SelectItem>
            {deals.map((deal) => (
              <SelectItem key={deal.id} value={deal.id}>
                {deal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

