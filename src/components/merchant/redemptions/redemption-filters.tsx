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
import type { RedemptionFilters } from '@/types/redemption'
import { RedemptionStatus } from '@/types/redemption'
import { useMerchantDeals } from '@/hooks/merchant'
import { DealStatus } from '@/types/deal'
import type { DealListResponse } from '@/types/deal'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface RedemptionFiltersProps {
  className?: string
}

/**
 * Redemption Filters Component
 * 
 * Filter bar for redemptions with date range, deal, status, and customer search filters.
 * Filters are synced with URL for shareable/bookmarkable links.
 */
export function RedemptionFilters({ className }: RedemptionFiltersProps) {
  const { filters, updateFilters, clearFilters } = useMerchantFilters<RedemptionFilters>({
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
      const fromDate = new Date(filters.startDate)
      const toDate = new Date(filters.endDate)
      return {
        from: fromDate,
        to: toDate,
      }
    }
    return undefined
  })

  // Track popover open state and first selected date
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [firstSelectedDate, setFirstSelectedDate] = useState<Date | null>(null)
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined)

  const hasActiveFilters =
    filters.status ||
    filters.dealId ||
    filters.search ||
    filters.startDate ||
    filters.endDate

  const handleDateRangeChange = (range: DateRange | undefined) => {
    // First click - user selects first date
    if (range?.from && !firstSelectedDate && !range.to) {
      setFirstSelectedDate(range.from)
      setTempRange({ from: range.from, to: undefined })
      setDateRange({ from: range.from, to: undefined })
      // Keep calendar open, don't update filters yet
      return
    }

    // Second click - range is complete (both from and to are set)
    if (firstSelectedDate && range?.from && range?.to) {
      const secondDate = range.to
      
      // Check if same date clicked (compare dates, ignore time)
      const isSameDate = 
        firstSelectedDate.getFullYear() === secondDate.getFullYear() &&
        firstSelectedDate.getMonth() === secondDate.getMonth() &&
        firstSelectedDate.getDate() === secondDate.getDate()

      if (isSameDate) {
        // Same date clicked - set as single date and close
        const singleDate = firstSelectedDate
        setDateRange({ from: singleDate, to: singleDate })
        setTempRange({ from: singleDate, to: singleDate })
        setFirstSelectedDate(null)
        setIsPopoverOpen(false)
        updateFilters({
          startDate: singleDate.toISOString(),
          endDate: singleDate.toISOString(),
          page: 1,
        })
        return
      }

      // Different date clicked - create range (auto-order: earlier = from, later = to)
      const fromDate = firstSelectedDate < secondDate ? firstSelectedDate : secondDate
      const toDate = firstSelectedDate < secondDate ? secondDate : firstSelectedDate

      setDateRange({ from: fromDate, to: toDate })
      setTempRange({ from: fromDate, to: toDate })
      setFirstSelectedDate(null)
      setIsPopoverOpen(false)
      updateFilters({
        startDate: fromDate.toISOString(),
        endDate: toDate.toISOString(),
        page: 1,
      })
      return
    }

    // Handle case where range is cleared after first click (clicking same date again)
    if ((!range || !range.from) && firstSelectedDate) {
      // User clicked same date again - react-day-picker cleared it
      // Set it as single date immediately and close calendar
      const singleDate = firstSelectedDate
      setDateRange({ from: singleDate, to: singleDate })
      setTempRange({ from: singleDate, to: singleDate })
      setFirstSelectedDate(null)
      setIsPopoverOpen(false)
      updateFilters({
        startDate: singleDate.toISOString(),
        endDate: singleDate.toISOString(),
        page: 1,
      })
      return
    }

    // If no range and no first selected date, reset everything
    if (!range || !range.from) {
      setDateRange(undefined)
      setTempRange(undefined)
      setFirstSelectedDate(null)
      updateFilters({
        startDate: undefined,
        endDate: undefined,
        page: 1,
      })
    }
  }

  // Handle popover open/close
  const handlePopoverOpenChange = (open: boolean) => {
    // When opening, restore state
    if (open) {
      // If we have existing dateRange, use it
      if (dateRange?.from && dateRange?.to) {
        setTempRange(dateRange)
        setFirstSelectedDate(null) // Reset first selected date when opening with existing range
      } else if (dateRange?.from && !dateRange?.to) {
        // If we have a partial range (only from), restore it
        setTempRange({ from: dateRange.from, to: undefined })
        setFirstSelectedDate(dateRange.from)
      } else {
        setTempRange(undefined)
        setFirstSelectedDate(null)
      }
      setIsPopoverOpen(true)
      return
    }
    
    // When closing - if only first date selected, make it single date
    if (!open && firstSelectedDate && dateRange?.from && !dateRange?.to) {
      const singleDate = firstSelectedDate
      setDateRange({ from: singleDate, to: singleDate })
      setTempRange({ from: singleDate, to: singleDate })
      setFirstSelectedDate(null)
      updateFilters({
        startDate: singleDate.toISOString(),
        endDate: singleDate.toISOString(),
        page: 1,
      })
    }
    
    setIsPopoverOpen(open)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* First Row: Search and Status */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or email..."
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
              status: value === 'all' ? undefined : (value as RedemptionStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={RedemptionStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={RedemptionStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={RedemptionStatus.CANCELLED}>Cancelled</SelectItem>
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
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
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
                  // If from and to are the same, show single date
                  dateRange.from.getTime() === dateRange.to.getTime() ? (
                    format(dateRange.from, 'LLL dd, y')
                  ) : (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  )
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from || tempRange?.from}
              selected={tempRange || dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={1}
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
