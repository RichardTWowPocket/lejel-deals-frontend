# Loading States Guide

This document outlines the loading state patterns used in the merchant dashboard.

## Overview

The merchant dashboard implements comprehensive loading states with:
- **Skeleton loaders** for initial page loads
- **Background refetch indicators** for data updates
- **Mutation loading states** for user actions
- **Consistent patterns** across all pages

## Loading State Types

### 1. Initial Load (`isLoading`)

**When to Use:**
- First time loading data (no data yet)
- User navigates to a new page
- After filter changes that reset data

**Pattern:**
```tsx
const { data, isLoading, error } = useMerchantDeals(filters)

if (isLoading) {
  return <DealsListSkeleton />
}
```

**Components:**
- `KPICardsSkeleton` - Dashboard KPIs
- `DealsListSkeleton` - Deals list
- `OrdersListSkeleton` - Orders list
- `StaffListSkeleton` - Staff list
- `RedemptionsListSkeleton` - Redemptions list
- `MediaGridSkeleton` - Media library
- `PageHeaderSkeleton` - Page headers
- `DealDetailSkeleton` - Deal detail pages
- `FormSkeleton` - Form loading states
- `StatsCardsSkeleton` - Stats cards
- `PayoutChartSkeleton` - Chart loading

### 2. Background Refetch (`isFetching && !isLoading`)

**When to Use:**
- Data is already loaded but being refreshed
- Window focus refetch
- Polling updates
- Manual refresh

**Pattern:**
```tsx
const { data, isLoading, isFetching, error } = useMerchantDeals(filters)

// Show skeleton on initial load
if (isLoading) {
  return <DealsListSkeleton />
}

// Show subtle indicator on background refetch
{!isLoading && isFetching && data && (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <span>Refreshing...</span>
  </div>
)}

// Show data
<DealList deals={data?.deals || []} />
```

**Components:**
- `LoadingOverlay` - Full overlay for background refetch
- `InlineLoadingBadge` - Small inline indicator

### 3. Mutation Loading (`isPending`)

**When to Use:**
- User actions (create, update, delete)
- Form submissions
- Button clicks that trigger mutations

**Pattern:**
```tsx
const createDeal = useCreateDeal()

<Button
  type="submit"
  disabled={createDeal.isPending}
>
  {createDeal.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    'Create Deal'
  )}
</Button>
```

**Components:**
- `LoadingIndicator` - Spinner with text
- `InlineSpinner` - Compact spinner for buttons

## Loading State Patterns

### Pattern 1: Page-Level Loading

```tsx
export default function MerchantDealsPage() {
  const { data, isLoading, isFetching, error, refetch } = useMerchantDeals(filters)

  // Initial load - show skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <DealsListSkeleton />
      </div>
    )
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  // Background refetch indicator
  const isRefreshing = !isLoading && isFetching

  return (
    <div className="space-y-6">
      {isRefreshing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing...</span>
        </div>
      )}

      <DealList deals={data?.deals || []} />
    </div>
  )
}
```

### Pattern 2: Component-Level Loading

```tsx
export function DealList({ deals, isLoading, error, onRetry }: DealListProps) {
  if (isLoading) {
    return (
      <>
        <div className="hidden md:block">
          <TableSkeleton columns={6} rows={5} />
        </div>
        <div className="md:hidden">
          <DealsListSkeleton count={5} />
        </div>
      </>
    )
  }

  if (error) {
    return <EmptyState title="Failed to load deals" onRetry={onRetry} />
  }

  if (!deals || deals.length === 0) {
    return <EmptyState title="No deals found" />
  }

  return (
    <>
      {/* Table/Card view */}
    </>
  )
}
```

### Pattern 3: Mutation Loading

```tsx
export function DealActions({ deal }: { deal: Deal }) {
  const toggleStatus = useToggleDealStatus()
  const deleteDeal = useDeleteDeal()

  const isToggling = toggleStatus.isPending
  const isDeleting = deleteDeal.isPending

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isToggling || isDeleting}
        >
          {isToggling || isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => toggleStatus.mutate({ id: deal.id, status: 'PAUSED' })}
          disabled={isToggling || isDeleting}
        >
          <Pause className="mr-2 h-4 w-4" />
          {isToggling ? 'Pausing...' : 'Pause'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Pattern 4: Form Loading

```tsx
export function DealForm({ mode, dealId }: DealFormProps) {
  const { data: deal, isLoading: isLoadingDeal } = useMerchantDeal(dealId)
  const createDeal = useCreateDeal()
  const updateDeal = useUpdateDeal()

  const isLoading = isLoadingDeal || createDeal.isPending || updateDeal.isPending

  if (mode === 'edit' && isLoadingDeal) {
    return <FormSkeleton fields={8} />
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {getLoadingText(mode === 'create' ? 'Create' : 'Update', isLoading)}
          </>
        ) : (
          mode === 'create' ? 'Create Deal' : 'Update Deal'
        )}
      </Button>
    </form>
  )
}
```

## Best Practices

### 1. Use Appropriate Loading State

```tsx
// ✅ Good - Use isLoading for initial load
if (isLoading) {
  return <Skeleton />
}

// ✅ Good - Use isFetching for background refetch
{isFetching && !isLoading && (
  <LoadingOverlay text="Refreshing..." />
)}

// ❌ Avoid - Don't show skeleton on refetch
if (isFetching) {
  return <Skeleton /> // Wrong - hides existing data
}
```

### 2. Show Data During Refetch

```tsx
// ✅ Good - Keep data visible during refetch
{data && (
  <div className="relative">
    <DealList deals={data.deals} />
    {isFetching && !isLoading && (
      <LoadingOverlay text="Refreshing..." />
    )}
  </div>
)}

// ❌ Avoid - Don't hide data during refetch
if (isFetching) {
  return <Skeleton /> // Wrong - user loses context
}
```

### 3. Disable Actions During Mutations

```tsx
// ✅ Good - Disable button during mutation
<Button
  onClick={handleSubmit}
  disabled={mutation.isPending}
>
  {mutation.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    'Save'
  )}
</Button>

// ❌ Avoid - Allow multiple submissions
<Button onClick={handleSubmit}>Save</Button> // Wrong - can submit multiple times
```

### 4. Use Consistent Skeleton Components

```tsx
// ✅ Good - Use shared skeleton components
import { DealsListSkeleton } from '@/components/merchant/shared'

if (isLoading) {
  return <DealsListSkeleton />
}

// ❌ Avoid - Create custom skeletons for each page
if (isLoading) {
  return (
    <div className="space-y-4">
      {/* Custom skeleton code */}
    </div>
  )
}
```

### 5. Provide Loading Feedback

```tsx
// ✅ Good - Show what's happening
<Button disabled={isPending}>
  {isPending ? 'Creating Deal...' : 'Create Deal'}
</Button>

// ❌ Avoid - No feedback
<Button disabled={isPending}>Create Deal</Button> // User doesn't know why it's disabled
```

## Loading State Checklist

### For Each Page:
- [ ] Show skeleton on initial load (`isLoading`)
- [ ] Show background refetch indicator (`isFetching && !isLoading`)
- [ ] Handle error states
- [ ] Show empty states when no data

### For Each Mutation:
- [ ] Disable button during mutation (`isPending`)
- [ ] Show loading spinner in button
- [ ] Update button text to show action
- [ ] Provide error feedback

### For Each Form:
- [ ] Show form skeleton while loading initial data
- [ ] Disable submit button during submission
- [ ] Show loading state in submit button
- [ ] Handle validation errors

## Common Loading Patterns

### List Page
```tsx
const { data, isLoading, isFetching, error, refetch } = useMerchantDeals(filters)

if (isLoading) return <DealsListSkeleton />
if (error) return <ErrorDisplay error={error} onRetry={refetch} />
if (!data?.deals.length) return <EmptyState />

return (
  <>
    {isFetching && <InlineLoadingBadge text="Refreshing..." />}
    <DealList deals={data.deals} />
  </>
)
```

### Detail Page
```tsx
const { data, isLoading, error, refetch } = useMerchantDeal(dealId)

if (isLoading) return <DealDetailSkeleton />
if (error) return <ErrorDisplay error={error} onRetry={refetch} />

return <DealDetail deal={data} />
```

### Form Page
```tsx
const { data, isLoading } = useMerchantDeal(dealId)
const updateDeal = useUpdateDeal()

if (isLoading) return <FormSkeleton />

return (
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
    <Button disabled={updateDeal.isPending}>
      {updateDeal.isPending ? 'Saving...' : 'Save'}
    </Button>
  </form>
)
```

## Performance Optimization

### 1. Prevent Flickering

Use minimum loading time to prevent flickering on fast networks:

```tsx
import { useEffectiveLoading } from '@/lib/loading-utils'

const effectiveLoading = useEffectiveLoading(isLoading, 300)

if (effectiveLoading) {
  return <Skeleton />
}
```

### 2. Optimize Skeleton Components

- Use `Skeleton` component from shadcn/ui
- Keep skeleton count reasonable (5-10 items)
- Match skeleton layout to actual content

### 3. Lazy Load Heavy Components

```tsx
import dynamic from 'next/dynamic'

const PayoutChart = dynamic(() => import('./payout-chart'), {
  loading: () => <PayoutChartSkeleton />,
  ssr: false,
})
```

## Testing Loading States

### Test Scenarios:
1. **Slow Network**: Throttle to Slow 3G
2. **Fast Network**: Should still show minimum loading time
3. **Background Refetch**: Switch tabs, return to page
4. **Mutation Loading**: Click buttons, verify disabled state
5. **Error Recovery**: Trigger error, verify retry works

### Tools:
- Chrome DevTools Network throttling
- React Query DevTools
- Browser tab switching (triggers refetch)

## Troubleshooting

### Issue: Skeleton flashes too quickly
**Solution**: Use `useEffectiveLoading` hook with minimum time

### Issue: No loading indicator on refetch
**Solution**: Check `isFetching && !isLoading` condition

### Issue: Button doesn't show loading state
**Solution**: Ensure mutation hook returns `isPending`

### Issue: Loading state persists after error
**Solution**: Check error handling, ensure error state is checked before loading

---

**Document Created**: December 2024  
**Status**: 📋 **GUIDE**

