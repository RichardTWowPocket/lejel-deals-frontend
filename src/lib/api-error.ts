import axios from 'axios'
import { ApiError } from './api'

/**
 * Enhanced API Error interface with validation errors support
 */
export interface EnhancedApiError extends ApiError {
  errors?: Record<string, string[]>
}

/**
 * Type guard to check if error is an API error
 */
export function isApiError(error: unknown): error is EnhancedApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  )
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message || 'An error occurred'
  }
  
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as EnhancedApiError | undefined
    if (apiError?.message) {
      return apiError.message
    }
    return error.message || 'Network error occurred'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unknown error occurred'
}

/**
 * Get validation errors from API error
 * Returns object with field names as keys and error messages as values
 */
export function getValidationErrors(error: unknown): Record<string, string[]> {
  if (isApiError(error) && error.errors) {
    return error.errors
  }
  
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as EnhancedApiError | undefined
    if (apiError?.errors) {
      return apiError.errors
    }
  }
  
  return {}
}

/**
 * Error code constants
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

/**
 * Get error code from error
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (isApiError(error)) {
    const statusCode = error.statusCode
    
    if (statusCode === 401) return ERROR_CODES.UNAUTHORIZED
    if (statusCode === 403) return ERROR_CODES.FORBIDDEN
    if (statusCode === 404) return ERROR_CODES.NOT_FOUND
    if (statusCode === 422 || statusCode === 400) {
      return ERROR_CODES.VALIDATION_ERROR
    }
    if (statusCode >= 500) return ERROR_CODES.SERVER_ERROR
    if (statusCode === 408 || statusCode === 504) return ERROR_CODES.TIMEOUT
  }
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return ERROR_CODES.TIMEOUT
    }
    if (error.code === 'ERR_NETWORK') {
      return ERROR_CODES.NETWORK_ERROR
    }
    if (error.response?.status === 401) return ERROR_CODES.UNAUTHORIZED
    if (error.response?.status === 403) return ERROR_CODES.FORBIDDEN
    if (error.response?.status === 404) return ERROR_CODES.NOT_FOUND
    if (error.response?.status === 422 || error.response?.status === 400) {
      return ERROR_CODES.VALIDATION_ERROR
    }
    if (error.response?.status && error.response.status >= 500) {
      return ERROR_CODES.SERVER_ERROR
    }
  }
  
  if (error instanceof Error && error.message.includes('Network')) {
    return ERROR_CODES.NETWORK_ERROR
  }
  
  return ERROR_CODES.UNKNOWN
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return getErrorCode(error) === ERROR_CODES.VALIDATION_ERROR
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return getErrorCode(error) === ERROR_CODES.NETWORK_ERROR
}

/**
 * Check if error requires authentication
 */
export function isAuthError(error: unknown): boolean {
  const code = getErrorCode(error)
  return code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN
}



