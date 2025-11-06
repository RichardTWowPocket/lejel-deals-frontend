'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Don't retry on client errors (4xx)
              if (error && typeof error === 'object' && 'statusCode' in error) {
                const statusCode = error.statusCode as number
                if (statusCode >= 400 && statusCode < 500) {
                  // Don't retry on 401, 403, 404, 422
                  if ([401, 403, 404, 422].includes(statusCode)) {
                    return false
                  }
                }
              }
              // Retry up to 2 times for network/server errors
              return failureCount < 2
            },
            retryDelay: (attemptIndex) => {
              // Exponential backoff: 1s, 2s
              return Math.min(1000 * Math.pow(2, attemptIndex), 5000)
            },
          },
          mutations: {
            retry: false, // Don't retry mutations by default
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={5 * 60} // Refetch session every 5 minutes (in seconds)
        refetchOnWindowFocus={false} // Don't refetch on window focus
      >
        {children}
      </SessionProvider>
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#27AE60', /* --success */
              secondary: '#FFFFFF',
            },
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--success))',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#E74C3C', /* --destructive */
              secondary: '#FFFFFF',
            },
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--destructive))',
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

