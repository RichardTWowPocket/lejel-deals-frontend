import toast from 'react-hot-toast'
import { ERROR_CODES, getErrorMessage, getErrorCode, getValidationErrors } from './api-error'
import { logError, type ErrorLogContext } from './error-logger'

/**
 * Context for error handling (optional, for logging)
 */
export interface ErrorContext {
  action?: string
  resource?: string
  userId?: string
  merchantId?: string
  [key: string]: unknown
}

/**
 * Global error handler for API errors
 * Handles different error types and shows appropriate user feedback
 */
export function handleApiError(
  error: unknown,
  context?: ErrorContext | string
): void {
  const errorCode = getErrorCode(error)
  const message = getErrorMessage(error)
  const validationErrors = getValidationErrors(error)
  
  // Log error for debugging with structured logging
  const logContext: ErrorLogContext = typeof context === 'string' 
    ? { context, action: context }
    : {
        context: context?.action || 'API',
        action: context?.action,
        resource: context?.resource,
        userId: context?.userId,
        merchantId: context?.merchantId,
        additionalData: context,
      }
  
  logError(error, logContext)

  // Get user-friendly error message based on context and error code
  const userMessage = getUserFriendlyMessage(error, errorCode, message, validationErrors, context)

  // Handle specific error codes with user-friendly messages
  switch (errorCode) {
    case ERROR_CODES.UNAUTHORIZED:
      // Auto-logout is handled by axios interceptor
      // Just show a toast here
      toast.error(userMessage || 'Sesi Anda telah berakhir. Silakan login kembali.')
      break

    case ERROR_CODES.FORBIDDEN:
      toast.error(userMessage || 'Anda tidak memiliki izin untuk melakukan tindakan ini.')
      break

    case ERROR_CODES.NETWORK_ERROR:
      toast.error(userMessage || 'Terjadi kesalahan koneksi. Silakan periksa koneksi internet Anda dan coba lagi.')
      break

    case ERROR_CODES.TIMEOUT:
      toast.error(userMessage || 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.')
      break

    case ERROR_CODES.NOT_FOUND:
      toast.error(userMessage || 'Data yang diminta tidak ditemukan.')
      break

    case ERROR_CODES.VALIDATION_ERROR:
      // For validation errors, show field-specific errors if available
      if (Object.keys(validationErrors).length > 0) {
        // Show first validation error
        const firstField = Object.keys(validationErrors)[0]
        const firstError = validationErrors[firstField]?.[0]
        if (firstError) {
          toast.error(`${firstField}: ${firstError}`)
        } else {
          toast.error(userMessage || message || 'Terdapat kesalahan pada data yang dimasukkan. Silakan periksa kembali.')
        }
      } else {
        toast.error(userMessage || message || 'Terdapat kesalahan pada data yang dimasukkan. Silakan periksa kembali.')
      }
      // Don't break - validation errors are usually handled in forms
      break

    case ERROR_CODES.SERVER_ERROR:
      toast.error(userMessage || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.')
      break

    default:
      toast.error(userMessage || message || 'Terjadi kesalahan. Silakan coba lagi.')
  }
}

/**
 * Get user-friendly error message based on context
 */
function getUserFriendlyMessage(
  error: unknown,
  errorCode: string,
  message: string,
  validationErrors: Record<string, string[]>,
  context?: ErrorContext | string
): string {
  const action = typeof context === 'string' ? context : context?.action
  const resource = typeof context === 'object' ? context?.resource : undefined

  // Context-specific messages
  const actionMessages: Record<string, Record<string, string>> = {
    fetchMerchantOverview: {
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal memuat dashboard. Silakan periksa koneksi internet Anda.',
      [ERROR_CODES.SERVER_ERROR]: 'Gagal memuat dashboard. Silakan coba lagi nanti.',
      default: 'Gagal memuat dashboard. Silakan coba lagi.',
    },
    fetchMerchantDeals: {
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal memuat daftar promo. Silakan periksa koneksi internet Anda.',
      [ERROR_CODES.NOT_FOUND]: 'Tidak ada promo yang ditemukan.',
      default: 'Gagal memuat daftar promo. Silakan coba lagi.',
    },
    createDeal: {
      [ERROR_CODES.VALIDATION_ERROR]: 'Terdapat kesalahan pada data promo. Silakan periksa kembali.',
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal membuat promo. Silakan periksa koneksi internet Anda.',
      default: 'Gagal membuat promo. Silakan coba lagi.',
    },
    updateDeal: {
      [ERROR_CODES.VALIDATION_ERROR]: 'Terdapat kesalahan pada data promo. Silakan periksa kembali.',
      [ERROR_CODES.NOT_FOUND]: 'Promo tidak ditemukan.',
      default: 'Gagal memperbarui promo. Silakan coba lagi.',
    },
    deleteDeal: {
      [ERROR_CODES.NOT_FOUND]: 'Promo tidak ditemukan.',
      [ERROR_CODES.FORBIDDEN]: 'Anda tidak memiliki izin untuk menghapus promo ini.',
      default: 'Gagal menghapus promo. Silakan coba lagi.',
    },
    fetchMerchantOrders: {
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal memuat daftar pesanan. Silakan periksa koneksi internet Anda.',
      default: 'Gagal memuat daftar pesanan. Silakan coba lagi.',
    },
    fetchMerchantRedemptions: {
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal memuat daftar penukaran. Silakan periksa koneksi internet Anda.',
      default: 'Gagal memuat daftar penukaran. Silakan coba lagi.',
    },
    processRedemption: {
      [ERROR_CODES.NOT_FOUND]: 'Kode voucher tidak ditemukan atau sudah digunakan.',
      [ERROR_CODES.VALIDATION_ERROR]: 'Kode voucher tidak valid.',
      default: 'Gagal memproses penukaran. Silakan coba lagi.',
    },
    fetchMerchantStaff: {
      [ERROR_CODES.NETWORK_ERROR]: 'Gagal memuat daftar staf. Silakan periksa koneksi internet Anda.',
      default: 'Gagal memuat daftar staf. Silakan coba lagi.',
    },
    createStaff: {
      [ERROR_CODES.VALIDATION_ERROR]: 'Terdapat kesalahan pada data staf. Silakan periksa kembali.',
      default: 'Gagal menambahkan staf. Silakan coba lagi.',
    },
    uploadMedia: {
      [ERROR_CODES.VALIDATION_ERROR]: 'File tidak valid. Pastikan ukuran file tidak melebihi 5MB dan format yang didukung.',
      default: 'Gagal mengunggah file. Silakan coba lagi.',
    },
  }

  // Get action-specific message
  if (action && actionMessages[action]) {
    const actionMessage = actionMessages[action][errorCode] || actionMessages[action].default
    if (actionMessage) {
      return actionMessage
    }
  }

  // Resource-specific messages
  if (resource) {
    const resourceMessages: Record<string, Record<string, string>> = {
      deal: {
        [ERROR_CODES.NOT_FOUND]: 'Promo tidak ditemukan.',
        [ERROR_CODES.FORBIDDEN]: 'Anda tidak memiliki izin untuk mengakses promo ini.',
        default: 'Terjadi kesalahan pada promo. Silakan coba lagi.',
      },
      order: {
        [ERROR_CODES.NOT_FOUND]: 'Pesanan tidak ditemukan.',
        default: 'Terjadi kesalahan pada pesanan. Silakan coba lagi.',
      },
      staff: {
        [ERROR_CODES.NOT_FOUND]: 'Staf tidak ditemukan.',
        default: 'Terjadi kesalahan pada staf. Silakan coba lagi.',
      },
      media: {
        [ERROR_CODES.NOT_FOUND]: 'File tidak ditemukan.',
        default: 'Terjadi kesalahan pada file. Silakan coba lagi.',
      },
    }

    if (resourceMessages[resource]) {
      const resourceMessage = resourceMessages[resource][errorCode] || resourceMessages[resource].default
      if (resourceMessage) {
        return resourceMessage
      }
    }
  }

  // Return default message if no specific message found
  return message
}

/**
 * Handle validation errors specifically
 * Returns formatted errors for form fields
 */
export function handleValidationErrors(
  error: unknown
): Record<string, string> {
  const validationErrors = getValidationErrors(error)
  const formatted: Record<string, string> = {}

  Object.entries(validationErrors).forEach(([field, messages]) => {
    // Take first error message for each field
    formatted[field] = messages[0] || 'Invalid value'
  })

  return formatted
}

/**
 * Get error title for display
 */
export function getErrorTitle(error: unknown): string {
  const errorCode = getErrorCode(error)

  const titles: Record<string, string> = {
    [ERROR_CODES.NETWORK_ERROR]: 'Network Error',
    [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized',
    [ERROR_CODES.FORBIDDEN]: 'Access Denied',
    [ERROR_CODES.NOT_FOUND]: 'Not Found',
    [ERROR_CODES.VALIDATION_ERROR]: 'Validation Error',
    [ERROR_CODES.SERVER_ERROR]: 'Server Error',
    [ERROR_CODES.TIMEOUT]: 'Request Timeout',
    [ERROR_CODES.UNKNOWN]: 'Error',
  }

  return titles[errorCode] || 'Error'
}

/**
 * Get error description for display
 */
export function getErrorDescription(error: unknown): string {
  const errorCode = getErrorCode(error)
  const message = getErrorMessage(error)

  const descriptions: Record<string, string> = {
    [ERROR_CODES.NETWORK_ERROR]:
      'Unable to connect to server. Please check your internet connection.',
    [ERROR_CODES.UNAUTHORIZED]:
      'Your session has expired. Please log in again.',
    [ERROR_CODES.FORBIDDEN]:
      'You do not have permission to perform this action.',
    [ERROR_CODES.NOT_FOUND]:
      'The requested resource was not found.',
    [ERROR_CODES.VALIDATION_ERROR]: message,
    [ERROR_CODES.SERVER_ERROR]:
      'An error occurred on the server. Please try again later.',
    [ERROR_CODES.TIMEOUT]:
      'The request took too long to complete. Please try again.',
    [ERROR_CODES.UNKNOWN]: message || 'An unknown error occurred.',
  }

  return descriptions[errorCode] || message || 'An error occurred.'
}



