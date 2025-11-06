'use client'

import { useState, useEffect } from 'react'
import { Search, X, Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  // State to track the first selected date (before range is complete)
  const [firstSelectedDate, setFirstSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Local state for search input with debouncing
  const [searchInput, setSearchInput] = useState(filters.search || '')

  // Debounce search input - update filters after user stops typing for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchInput || undefined, page: 1 })
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Sync searchInput with filters.search when filters change externally (e.g., clear filters)
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search])

  const hasActiveFilters =
    filters.status ||
    filters.dealId ||
    filters.search ||
    filters.startDate ||
    filters.endDate

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    // If range is cleared/undefined, reset state
    if (!range || (!range.from && !range.to)) {
      setFirstSelectedDate(null)
      setDateRange(undefined)
      return
    }

    // If we already have a first selected date, this is the second click
    if (firstSelectedDate) {
      // When both from and to are set, the Calendar has completed the range
      // The Calendar component automatically orders dates (earlier = from, later = to)
      if (range.from && range.to) {
        // Both dates are set - use the range directly from Calendar
        const finalRange: DateRange = {
          from: range.from,
          to: range.to,
        }

        // Update state and close calendar
        setDateRange(finalRange)
        setFirstSelectedDate(null)
        setIsCalendarOpen(false)

        // Update filters
        updateFilters({
          startDate: format(range.from!, 'yyyy-MM-dd'),
          endDate: format(range.to!, 'yyyy-MM-dd'),
          page: 1,
        })
        return
      }

      // If only one date is set, it might be the second date being selected
      // But this shouldn't happen in range mode - both should be set
      // Fallback: treat the single date as the second date
      const secondDate = range.from || range.to
      if (!secondDate) return

      // Compare dates to determine range order
      const firstTime = new Date(
        firstSelectedDate.getFullYear(),
        firstSelectedDate.getMonth(),
        firstSelectedDate.getDate()
      ).getTime()
      const secondTime = new Date(
        secondDate.getFullYear(),
        secondDate.getMonth(),
        secondDate.getDate()
      ).getTime()

      let finalRange: DateRange

      if (secondTime > firstTime) {
        // Second date is in the future - range from first to second
        finalRange = {
          from: firstSelectedDate,
          to: secondDate,
        }
      } else if (secondTime < firstTime) {
        // Second date is in the past - range from second to first
        finalRange = {
          from: secondDate,
          to: firstSelectedDate,
        }
      } else {
        // Same date - treat as single date range
        finalRange = {
          from: firstSelectedDate,
          to: firstSelectedDate,
        }
      }

      // Update state and close calendar
      setDateRange(finalRange)
      setFirstSelectedDate(null)
      setIsCalendarOpen(false)

      // Update filters
    updateFilters({
        startDate: format(finalRange.from!, 'yyyy-MM-dd'),
        endDate: format(finalRange.to!, 'yyyy-MM-dd'),
      page: 1,
    })
      return
    }

    // First click - save the date and keep calendar open
    // When there's an existing range, clicking a date should start a new selection
    // In range mode, when clicking a date, the Calendar might pass both from and to
    // We need to ignore the existing range and only use the newly clicked date
    const clickedDate = range.from || range.to
    if (clickedDate) {
      // Always start fresh - use only the clicked date as the first selection
      setFirstSelectedDate(clickedDate)
      // Show only the first selected date in the calendar (not the old range)
      setDateRange({ from: clickedDate, to: undefined })
      // Explicitly keep calendar open - prevent any auto-close
      setIsCalendarOpen(true)
    }
  }

  const handleCalendarOpenChange = (open: boolean) => {
    // Prevent closing if we have a first selected date (waiting for second date)
    if (!open && firstSelectedDate) {
      // Force keep it open - use requestAnimationFrame to ensure state update happens after the close attempt
      requestAnimationFrame(() => {
        setIsCalendarOpen(true)
      })
      return
    }
    
    setIsCalendarOpen(open)
    if (open) {
      // When opening calendar, reset first selected date to allow new selection
      // This ensures clicking a date starts a fresh selection, not updating existing range
      setFirstSelectedDate(null)
    } else {
      // When closing calendar without completing selection, reset first selected date
      if (firstSelectedDate) {
        setFirstSelectedDate(null)
        // Restore previous date range if it existed
        if (filters.startDate && filters.endDate) {
          setDateRange({
            from: new Date(filters.startDate),
            to: new Date(filters.endDate),
          })
        } else {
          // If no previous range, clear the partial selection
          setDateRange(undefined)
        }
      }
    }
  }

  // Get selected deal name for display
  const selectedDeal = deals.find((deal) => deal.id === filters.dealId)

  return (
    <div className={cn('flex flex-col gap-3 md:gap-4', className)}>
      {/* Mobile Layout (< md): Horizontal Scrollable Filters */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number, customer name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Filter Chips - Horizontal Scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              updateFilters({
                status: value === 'all' ? undefined : (value as OrderStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 min-w-[120px]">
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

          <Popover 
            open={isCalendarOpen || !!firstSelectedDate} 
            onOpenChange={handleCalendarOpenChange}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 min-w-[140px] justify-start text-left font-normal text-xs',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                      </>
                    ) : (
                      format(dateRange.from, 'MMM dd')
                    )
                  ) : (
                    'Date Range'
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0" 
              align="start"
              onInteractOutside={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
              onEscapeKeyDown={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
              onPointerDownOutside={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
            >
              <Calendar
                key={isCalendarOpen ? 'open' : 'closed'}
                initialFocus
                mode="range"
                defaultMonth={firstSelectedDate || dateRange?.from || undefined}
                selected={
                  firstSelectedDate
                    ? { from: firstSelectedDate, to: undefined }
                    : dateRange
                }
                onSelect={handleDateRangeSelect}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={filters.dealId || 'all'}
            onValueChange={(value) =>
              updateFilters({ dealId: value === 'all' ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger className="h-9 min-w-[120px]">
              <SelectValue placeholder="Deal" />
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

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2 text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active Filter Badges - Mobile Only */}
        {(filters.status || filters.dealId || dateRange?.from) && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.status && (
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                <span className="text-xs capitalize">{filters.status.toLowerCase()}</span>
                <button
                  onClick={() => updateFilters({ status: undefined, page: 1 })}
                  className="ml-0.5 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {dateRange?.from && dateRange?.to && (
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                <CalendarIcon className="h-3 w-3" />
                <span className="text-xs">
                  {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                </span>
                <button
                  onClick={() => {
                    setDateRange(undefined)
                    updateFilters({ startDate: undefined, endDate: undefined, page: 1 })
                  }}
                  className="ml-0.5 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDeal && (
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                <span className="text-xs truncate max-w-[120px]">{selectedDeal.title}</span>
                <button
                  onClick={() => updateFilters({ dealId: undefined, page: 1 })}
                  className="ml-0.5 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout (>= md): Usual UI/UX */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        {/* First Row: Search and Status */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order number, customer name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

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
          <Popover 
            open={isCalendarOpen || !!firstSelectedDate} 
            onOpenChange={handleCalendarOpenChange}
          >
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
            <PopoverContent 
              className="w-auto p-0" 
              align="start"
              onInteractOutside={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
              onEscapeKeyDown={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
              onPointerDownOutside={(e) => {
                if (firstSelectedDate) {
                  e.preventDefault()
                }
              }}
            >
            <Calendar
                key={isCalendarOpen ? 'open' : 'closed'}
              initialFocus
              mode="range"
                defaultMonth={firstSelectedDate || dateRange?.from || undefined}
                selected={
                  firstSelectedDate
                    ? { from: firstSelectedDate, to: undefined }
                    : dateRange
                }
                onSelect={handleDateRangeSelect}
                numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

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
    </div>
  )
}

