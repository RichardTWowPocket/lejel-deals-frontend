'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { logError } from '@/lib/error-logger'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Error Boundary Component
 * 
 * Catches React errors and displays a user-friendly error UI.
 * Logs errors for debugging.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    logError(error, {
      context: 'ErrorBoundary',
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    })

    this.setState({
      errorInfo,
    })

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        )
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                Terjadi Kesalahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba refresh
                halaman atau kembali ke beranda.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="rounded-md bg-muted p-3 text-xs">
                  <summary className="cursor-pointer font-medium">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="default"
                  onClick={this.resetError}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Coba Lagi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/')}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Error Boundary Hook (for functional components)
 * 
 * Use this in components that need error boundary functionality
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      logError(error, {
        context: 'useErrorHandler',
      })
      throw error
    }
  }, [error])

  return (error: Error) => {
    setError(error)
  }
}

