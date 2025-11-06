# Error Handling Guide

This document outlines the error handling patterns used in the merchant dashboard.

## Overview

The merchant dashboard implements comprehensive error handling with:
- **Structured error logging** for debugging
- **User-friendly error messages** in Bahasa Indonesia
- **Retry mechanisms** with exponential backoff
- **Error boundaries** for unhandled React errors
- **Context-aware error messages** based on action/resource

## Error Handling Components

### 1. ErrorDisplay Component

Primary component for displaying errors to users.

**Usage:**
```tsx
import { ErrorDisplay } from '@/components/merchant/shared'

<ErrorDisplay
  error={error}
  onRetry={refetch}
  title="Gagal memuat data"
  retryLabel="Coba Lagi"
/>
```

**Props:**
- `error`: The error object (unknown type)
- `onRetry`: Optional retry function (can be async)
- `title`: Optional custom error title
- `description`: Optional custom error description
- `variant`: 'default' | 'compact'
- `showRetryButton`: Show/hide retry button (default: true)
- `retryLabel`: Custom retry button label (default: "Coba Lagi")

### 2. ErrorBoundary Component

Catches React errors and prevents app crashes.

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/merchant/shared'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches unhandled React errors
- Logs errors for debugging
- Shows user-friendly error UI
- Provides retry and navigation options
- Shows error details in development mode

### 3. Error Logger

Structured error logging utility.

**Usage:**
```tsx
import { logError } from '@/lib/error-logger'

logError(error, {
  context: 'fetchMerchantDeals',
  userId: user?.id,
  merchantId: merchant?.id,
  action: 'fetchMerchantDeals',
  resource: 'deal',
  additionalData: { filters },
})
```

**Features:**
- Structured error format
- Environment-aware logging (development vs production)
- Ready for error tracking service integration (Sentry, etc.)
- Includes context, user info, and additional data

### 4. Error Handler

Global error handler for API errors.

**Usage:**
```tsx
import { handleApiError } from '@/lib/error-handler'

try {
  await api.post('/endpoint', data)
} catch (error) {
  handleApiError(error, {
    action: 'createDeal',
    resource: 'deal',
    userId: user?.id,
    merchantId: merchant?.id,
  })
}
```

**Features:**
- Context-aware error messages
- Automatic error logging
- Toast notifications
- User-friendly messages in Bahasa Indonesia

## Error Messages

### Context-Specific Messages

Error messages are context-aware based on:
- **Action**: `fetchMerchantDeals`, `createDeal`, `updateDeal`, etc.
- **Resource**: `deal`, `order`, `staff`, `media`, etc.
- **Error Code**: Network, validation, server, etc.

### Message Examples

**Network Errors:**
- "Gagal memuat dashboard. Silakan periksa koneksi internet Anda."
- "Gagal memuat daftar promo. Silakan periksa koneksi internet Anda."

**Validation Errors:**
- "Terdapat kesalahan pada data promo. Silakan periksa kembali."
- "File tidak valid. Pastikan ukuran file tidak melebihi 5MB dan format yang didukung."

**Not Found Errors:**
- "Promo tidak ditemukan."
- "Pesanan tidak ditemukan."

## Retry Mechanisms

### React Query Retry

React Query automatically retries failed queries with exponential backoff:
- Max 2 retries for network/server errors
- No retry for client errors (4xx)
- Exponential backoff: 1s, 2s

### Manual Retry

Use `refetch` from React Query hooks:

```tsx
const { data, error, refetch } = useMerchantDeals(filters)

<ErrorDisplay error={error} onRetry={refetch} />
```

### Retry Utilities

For custom retry logic:

```tsx
import { retryWithBackoff } from '@/lib/retry-utils'

const result = await retryWithBackoff(
  async () => await api.get('/endpoint'),
  {
    maxRetries: 3,
    initialDelay: 1000,
    retryCondition: shouldRetryNetworkError,
  }
)
```

## Error Codes

Standard error codes used throughout the application:

- `NETWORK_ERROR`: Connection issues
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Permission denied
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `SERVER_ERROR`: Server-side error (5xx)
- `TIMEOUT`: Request timeout
- `UNKNOWN`: Unknown error

## Best Practices

### 1. Always Use ErrorDisplay

```tsx
// ✅ Good
if (error) {
  return <ErrorDisplay error={error} onRetry={refetch} />
}

// ❌ Avoid
if (error) {
  return <div>Error occurred</div>
}
```

### 2. Provide Context for Logging

```tsx
// ✅ Good
handleApiError(error, {
  action: 'createDeal',
  resource: 'deal',
  userId: user?.id,
})

// ❌ Avoid
handleApiError(error)
```

### 3. Use Retry When Appropriate

```tsx
// ✅ Good - Retry for queries
<ErrorDisplay error={error} onRetry={refetch} />

// ✅ Good - No retry for mutations (user should fix input)
<ErrorDisplay error={error} showRetryButton={false} />
```

### 4. Log Errors for Debugging

```tsx
// ✅ Good
try {
  await operation()
} catch (error) {
  logError(error, {
    context: 'operationName',
    additionalData: { params },
  })
  throw error
}
```

### 5. Handle Validation Errors in Forms

```tsx
// ✅ Good
const { handleSubmit, setError } = useForm()

try {
  await createDeal(data)
} catch (error) {
  if (isValidationError(error)) {
    const validationErrors = handleValidationErrors(error)
    Object.entries(validationErrors).forEach(([field, message]) => {
      setError(field, { message })
    })
  } else {
    handleApiError(error, { action: 'createDeal' })
  }
}
```

## Common Patterns

### Page-Level Error Handling

```tsx
export default function MerchantDealsPage() {
  const { data, isLoading, error, refetch } = useMerchantDeals(filters)

  if (isLoading) return <LoadingSkeleton />
  
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Gagal memuat daftar promo"
      />
    )
  }

  return <DealList deals={data?.deals} />
}
```

### Mutation Error Handling

```tsx
const createDeal = useMutation({
  mutationFn: async (data) => {
    return await api.post('/deals', data)
  },
  onError: (error) => {
    handleApiError(error, {
      action: 'createDeal',
      resource: 'deal',
    })
  },
  onSuccess: () => {
    toast.success('Promo berhasil dibuat')
  },
})
```

### Component-Level Error Handling

```tsx
function DealCard({ dealId }: { dealId: string }) {
  const { data, error, refetch } = useDeal(dealId)

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        variant="compact"
      />
    )
  }

  return <Card>{/* Deal content */}</Card>
}
```

## Testing Error Scenarios

### Network Errors
- Disconnect internet
- Block network requests in DevTools
- Use slow 3G throttling

### Server Errors
- Simulate 500 errors
- Test timeout scenarios
- Test rate limiting

### Validation Errors
- Submit invalid form data
- Test required field validation
- Test format validation

### Authentication Errors
- Test expired sessions
- Test invalid tokens
- Test permission denied

## Future Enhancements

1. **Error Tracking Service Integration**
   - Integrate with Sentry or similar service
   - Track error trends and patterns
   - Alert on critical errors

2. **Error Recovery**
   - Automatic retry with user notification
   - Offline support with error queuing
   - Smart retry based on error type

3. **Error Analytics**
   - Error frequency tracking
   - User impact analysis
   - Error resolution metrics

